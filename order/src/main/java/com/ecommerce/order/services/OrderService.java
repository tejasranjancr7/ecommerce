package com.ecommerce.order.services;

import com.ecommerce.order.clients.UserServiceClient;
import com.ecommerce.order.dtos.OrderCreatedEvent;
import com.ecommerce.order.dtos.UserResponse;
import com.ecommerce.order.repositories.OrderRepository;
import com.ecommerce.order.models.OrderStatus;
import com.ecommerce.order.dtos.OrderItemDTO;
import com.ecommerce.order.dtos.OrderResponse;
import com.ecommerce.order.models.CartItem;
import com.ecommerce.order.models.Order;
import com.ecommerce.order.models.OrderItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import com.ecommerce.order.dtos.CreateOrderRequest;
import com.ecommerce.order.clients.ProductServiceClient;
import com.ecommerce.order.dtos.ProductResponse;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final CartService cartService;
    private final OrderRepository orderRepository;
    private final StreamBridge streamBridge;
    private final UserServiceClient userServiceClient;
    private final ProductServiceClient productServiceClient;

    public Optional<OrderResponse> createOrder(String userId) {
        return createOrder(userId, null);
    }

    public Optional<OrderResponse> createOrder(String userId, CreateOrderRequest request) {
        // Validate cart is not empty
        List<CartItem> cartItems = cartService.getCart(userId);
        if (cartItems.isEmpty()) {
            return Optional.empty();
        }

        // Fetch user details (for email notification)
        UserResponse user = userServiceClient.getUserDetails(userId);

        // Calculate item subtotal
        BigDecimal subTotal = cartItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discountAmount = (request != null && request.getDiscountAmount() != null)
                ? request.getDiscountAmount()
                : BigDecimal.ZERO;

        String couponCode = (request != null && request.getCouponCode() != null)
                ? request.getCouponCode()
                : "";

        BigDecimal shippingCharge;
        if (subTotal.compareTo(BigDecimal.valueOf(499)) >= 0 || subTotal.compareTo(BigDecimal.ZERO) == 0) {
            shippingCharge = BigDecimal.ZERO;
        } else if (request != null && request.getShippingCharge() != null) {
            shippingCharge = request.getShippingCharge();
        } else {
            shippingCharge = BigDecimal.valueOf(49);
        }

        BigDecimal finalAmount = subTotal.subtract(discountAmount).max(BigDecimal.ZERO).add(shippingCharge);

        // Create order
        Order order = new Order();
        order.setUserId(userId);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setSubTotalAmount(subTotal);
        order.setDiscountAmount(discountAmount);
        order.setCouponCode(couponCode);
        order.setShippingCharge(shippingCharge);
        order.setTotalAmount(finalAmount);

        List<OrderItem> orderItems = cartItems.stream()
                .map(item -> new OrderItem(
                        null,
                        item.getProductId(),
                        item.getQuantity(),
                        item.getPrice(),
                        order
                ))
                .toList();

        order.setItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        // Clear the cart
        cartService.clearCart(userId);

        // Build and publish OrderCreatedEvent with user email + name
        String userEmail;
        if (request != null && request.getCustomerEmail() != null && !request.getCustomerEmail().isBlank()) {
            userEmail = request.getCustomerEmail().trim();
        } else {
            userEmail = (user != null && user.getEmail() != null) ? user.getEmail() : "";
        }

        String userName;
        if (request != null && request.getCustomerName() != null && !request.getCustomerName().isBlank()) {
            userName = request.getCustomerName().trim();
        } else if (user != null && user.getFirstName() != null && !user.getFirstName().isBlank()) {
            String last = (user.getLastName() != null && !user.getLastName().isBlank()) ? " " + user.getLastName().trim() : "";
            userName = (user.getFirstName().trim() + last).trim();
        } else {
            userName = "Customer";
        }

        List<OrderItemDTO> orderItemDTOs = mapToOrderItemDTOs(savedOrder.getItems());

        OrderCreatedEvent event = new OrderCreatedEvent(
                savedOrder.getId(),
                savedOrder.getUserId(),
                userEmail,
                userName,
                savedOrder.getStatus(),
                orderItemDTOs,
                savedOrder.getSubTotalAmount(),
                savedOrder.getDiscountAmount(),
                savedOrder.getCouponCode(),
                savedOrder.getShippingCharge(),
                savedOrder.getTotalAmount(),
                savedOrder.getCreatedAt()
        );

        log.info("Publishing OrderCreatedEvent for order: {} to user: {} ({}) with subTotal: {}, discount: {}, total: {}",
                savedOrder.getId(), userName, userEmail, savedOrder.getSubTotalAmount(), savedOrder.getDiscountAmount(), savedOrder.getTotalAmount());
        streamBridge.send("createOrder-out-0", event);

        return Optional.of(mapToOrderResponse(savedOrder));
    }

    private List<OrderItemDTO> mapToOrderItemDTOs(List<OrderItem> items) {
        return items.stream()
                .map(this::toOrderItemDTO)
                .collect(Collectors.toList());
    }

    private OrderItemDTO toOrderItemDTO(OrderItem item) {
        String prodName = "Product #" + item.getProductId();
        try {
            ProductResponse prod = productServiceClient.getProductDetails(item.getProductId());
            if (prod != null && prod.getName() != null && !prod.getName().isBlank()) {
                prodName = prod.getName();
            }
        } catch (Exception e) {
            log.warn("Could not fetch product details for productId {}: {}", item.getProductId(), e.getMessage());
        }
        return new OrderItemDTO(
                item.getId(),
                item.getProductId(),
                prodName,
                item.getQuantity(),
                item.getPrice(),
                item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
        );
    }

    private OrderResponse mapToOrderResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getSubTotalAmount(),
                order.getDiscountAmount(),
                order.getCouponCode(),
                order.getShippingCharge(),
                order.getTotalAmount(),
                order.getStatus(),
                mapToOrderItemDTOs(order.getItems()),
                order.getCreatedAt()
        );
    }
}

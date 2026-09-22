package com.ecommerce.notification;

import com.ecommerce.notification.payload.OrderCreatedEvent;
import com.ecommerce.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.function.Consumer;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final EmailService emailService;

    @Bean
    public Consumer<OrderCreatedEvent> orderCreated() {
        return event -> {
            log.info("Received OrderCreatedEvent — orderId: {}, user: {}, email: {}",
                    event.getOrderId(), event.getUserName(), event.getUserEmail());
            emailService.sendOrderConfirmationEmail(event);
        };
    }
}

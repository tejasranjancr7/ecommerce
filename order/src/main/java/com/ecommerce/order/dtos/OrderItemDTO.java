package com.ecommerce.order.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    private Long id;
    private String productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subTotal;

    public OrderItemDTO(Long id, String productId, Integer quantity, BigDecimal price, BigDecimal subTotal) {
        this(id, productId, null, quantity, price, subTotal);
    }
}

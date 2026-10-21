package com.ecommerce.order.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private BigDecimal discountAmount;
    private String couponCode;
    private BigDecimal shippingCharge;
    private BigDecimal finalAmount;
    private String customerName;
    private String customerEmail;
}

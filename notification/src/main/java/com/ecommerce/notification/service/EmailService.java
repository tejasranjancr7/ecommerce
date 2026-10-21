package com.ecommerce.notification.service;

import com.ecommerce.notification.payload.OrderCreatedEvent;
import com.ecommerce.notification.payload.OrderItemDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final InvoiceService invoiceService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOrderConfirmationEmail(OrderCreatedEvent event) {
        if (event.getUserEmail() == null || event.getUserEmail().isBlank()) {
            log.warn("No email address found for order: {}. Skipping email.", event.getOrderId());
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(event.getUserEmail());
            helper.setSubject("✅ Order Confirmed — Order #" + event.getOrderId());
            helper.setText(buildHtmlEmail(event), true);

            // Generate and attach PDF Invoice
            byte[] pdfInvoice = invoiceService.generateInvoice(event);
            if (pdfInvoice != null && pdfInvoice.length > 0) {
                helper.addAttachment("Invoice_Order_" + event.getOrderId() + ".pdf", new ByteArrayResource(pdfInvoice));
            }

            mailSender.send(message);
            log.info("Order confirmation email sent to: {} for order: {}", event.getUserEmail(), event.getOrderId());

        } catch (MessagingException e) {
            log.error("Failed to send order confirmation email for order: {}. Error: {}", event.getOrderId(), e.getMessage());
        }
    }

    private String buildHtmlEmail(OrderCreatedEvent event) {
        String formattedDate = event.getCreatedAt() != null
                ? event.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"))
                : "N/A";
        String customerName = (event.getUserName() != null && !event.getUserName().isBlank())
                ? event.getUserName()
                : "Customer";
        String customerEmail = event.getUserEmail() != null ? event.getUserEmail() : "N/A";

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        StringBuilder itemRows = new StringBuilder();
        if (event.getItems() != null) {
            for (OrderItemDTO item : event.getItems()) {
                String productName = (item.getProductName() != null && !item.getProductName().isBlank())
                        ? item.getProductName()
                        : ("Product #" + item.getProductId());
                BigDecimal subTotal = item.getSubTotal() != null ? item.getSubTotal() : item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                calculatedTotal = calculatedTotal.add(subTotal);
                itemRows.append("""
                        <tr>
                            <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; color: #374151;">
                                %s
                            </td>
                            <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; color: #374151; text-align: center;">
                                %d
                            </td>
                            <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; color: #374151; text-align: right;">
                                ₹%.2f
                            </td>
                            <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 600; color: #111827; text-align: right;">
                                ₹%.2f
                            </td>
                        </tr>
                        """.formatted(
                        productName,
                        item.getQuantity(),
                        item.getPrice(),
                        subTotal
                ));
            }
        }

        BigDecimal subTotalAmount = (event.getSubTotalAmount() != null && event.getSubTotalAmount().compareTo(BigDecimal.ZERO) > 0)
                ? event.getSubTotalAmount()
                : ((calculatedTotal.compareTo(BigDecimal.ZERO) > 0)
                    ? calculatedTotal
                    : (event.getTotalAmount() != null ? event.getTotalAmount() : BigDecimal.ZERO));

        BigDecimal discountAmount = (event.getDiscountAmount() != null)
                ? event.getDiscountAmount()
                : BigDecimal.ZERO;

        boolean isFreeShipping;
        BigDecimal shippingFee;
        if (event.getShippingCharge() != null) {
            shippingFee = event.getShippingCharge();
            isFreeShipping = shippingFee.compareTo(BigDecimal.ZERO) == 0;
        } else {
            isFreeShipping = subTotalAmount.compareTo(BigDecimal.valueOf(499)) >= 0 || subTotalAmount.compareTo(BigDecimal.ZERO) == 0;
            shippingFee = isFreeShipping ? BigDecimal.ZERO : BigDecimal.valueOf(49);
        }

        BigDecimal grandTotal = subTotalAmount.subtract(discountAmount).max(BigDecimal.ZERO).add(shippingFee);

        String shippingDisplay = isFreeShipping
                ? "<span style=\"color:#16a34a; font-weight:600;\">FREE</span>"
                : "<span style=\"color:#b45309; font-weight:700;\">₹" + String.format("%.2f", shippingFee) + "</span>";

        String couponRow = "";
        if (discountAmount.compareTo(BigDecimal.ZERO) > 0) {
            String couponLabel = (event.getCouponCode() != null && !event.getCouponCode().isBlank())
                    ? "Coupon Discount (" + event.getCouponCode() + ")"
                    : "Coupon Discount";
            couponRow = """
                    <tr>
                        <td style="color:#16a34a; font-size:14px; font-weight:600; padding-bottom:8px;">%s</td>
                        <td style="color:#16a34a; font-size:14px; font-weight:600; text-align:right; padding-bottom:8px;">-₹%.2f</td>
                    </tr>
                    """.formatted(couponLabel, discountAmount);
        }

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>Order Confirmation</title>
                </head>
                <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: 'Segoe UI', Arial, sans-serif;">
                <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0"
                                   style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
                                               padding: 40px 40px 30px; text-align: center;">
                                        <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
                                        <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:700; letter-spacing:-0.5px;">
                                            Order Confirmed!
                                        </h1>
                                        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 15px;">
                                            Thank you for your purchase, %s
                                        </p>
                                    </td>
                                </tr>

                                <!-- Order Info Bar -->
                                <tr>
                                    <td style="padding: 24px 40px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                                        <table width="100%%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="text-align: center;">
                                                    <p style="margin:0; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Order ID</p>
                                                    <p style="margin:4px 0 0; font-size:20px; font-weight:700; color:#111827;">#%d</p>
                                                </td>
                                                <td style="text-align: center; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
                                                    <p style="margin:0; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Status</p>
                                                    <p style="margin:4px 0 0;">
                                                        <span style="background-color:#d1fae5; color:#065f46; padding:3px 12px;
                                                                     border-radius:20px; font-size:13px; font-weight:600;">
                                                            %s
                                                        </span>
                                                    </p>
                                                </td>
                                                <td style="text-align: center;">
                                                    <p style="margin:0; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:1px;">Order Date</p>
                                                    <p style="margin:4px 0 0; font-size:14px; font-weight:600; color:#111827;">%s</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Customer Info Card -->
                                <tr>
                                    <td style="padding: 24px 40px 0;">
                                        <table width="100%%" cellpadding="8" cellspacing="0"
                                               style="background-color:#f9fafb; border: 1px solid #e5e7eb; border-radius:8px;">
                                            <tr>
                                                <td style="color:#6b7280; font-size:13px; width:30%%;">Customer Name:</td>
                                                <td style="color:#111827; font-size:14px; font-weight:600;">%s</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#6b7280; font-size:13px;">Customer Email:</td>
                                                <td style="color:#111827; font-size:14px; font-weight:600;">%s</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Order Items -->
                                <tr>
                                    <td style="padding: 24px 40px 16px;">
                                        <h2 style="margin:0 0 16px; font-size:16px; color:#111827; font-weight:700;
                                                   text-transform:uppercase; letter-spacing:0.5px;">
                                            🛍️ Order Summary
                                        </h2>
                                        <table width="100%%" cellpadding="0" cellspacing="0"
                                               style="border: 1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
                                            <thead>
                                                <tr style="background-color:#f9fafb;">
                                                    <th style="padding:10px 16px; text-align:left; font-size:12px;
                                                               color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">
                                                        Product Name
                                                    </th>
                                                    <th style="padding:10px 16px; text-align:center; font-size:12px;
                                                               color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">
                                                        Qty
                                                    </th>
                                                    <th style="padding:10px 16px; text-align:right; font-size:12px;
                                                               color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">
                                                        Unit Price
                                                    </th>
                                                    <th style="padding:10px 16px; text-align:right; font-size:12px;
                                                               color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">
                                                        Subtotal
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                %s
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Totals -->
                                <tr>
                                    <td style="padding: 0 40px 32px;">
                                        <table width="100%%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="50%%"></td>
                                                <td width="50%%">
                                                    <table width="100%%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="color:#6b7280; font-size:14px; padding-bottom:8px;">Subtotal</td>
                                                            <td style="color:#374151; font-size:14px; text-align:right; padding-bottom:8px;">₹%.2f</td>
                                                        </tr>
                                                        %s
                                                        <tr>
                                                            <td style="color:#6b7280; font-size:14px; padding-bottom:8px;">Shipping</td>
                                                            <td style="font-size:14px; text-align:right; padding-bottom:8px;">%s</td>
                                                        </tr>
                                                        <tr style="border-top: 2px solid #e5e7eb;">
                                                            <td style="color:#111827; font-size:16px; font-weight:700; padding-top:10px;">Total</td>
                                                            <td style="color:#111827; font-size:18px; font-weight:700; text-align:right; padding-top:10px;">₹%.2f</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color:#f9fafb; padding: 24px 40px;
                                               border-top: 1px solid #e5e7eb; text-align:center;">
                                        <p style="margin:0; font-size:13px; color:#9ca3af;">
                                            Questions? Reply to this email or contact our support team.
                                        </p>
                                        <p style="margin:8px 0 0; font-size:12px; color:#d1d5db;">
                                            © 2025 eCommerce Platform. All rights reserved.
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
                </body>
                </html>
                """.formatted(
                customerName,
                event.getOrderId(),
                event.getStatus(),
                formattedDate,
                customerName,
                customerEmail,
                itemRows.toString(),
                subTotalAmount,
                couponRow,
                shippingDisplay,
                grandTotal
        );
    }
}

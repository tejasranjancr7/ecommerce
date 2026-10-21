package com.ecommerce.notification.service;

import com.ecommerce.notification.payload.OrderCreatedEvent;
import com.ecommerce.notification.payload.OrderItemDTO;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class InvoiceService {

    public byte[] generateInvoice(OrderCreatedEvent event) {
        log.info("Generating invoice for order: {}", event.getOrderId());
        
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);

            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.BLACK);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);

            // Title
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Order & Customer Info
            document.add(new Paragraph("Order ID: #" + event.getOrderId(), normalFont));
            String formattedDate = event.getCreatedAt() != null 
                ? event.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")) 
                : "N/A";
            document.add(new Paragraph("Order Date: " + formattedDate, normalFont));
            String customerName = (event.getUserName() != null && !event.getUserName().isBlank())
                ? event.getUserName()
                : "Customer";
            document.add(new Paragraph("Customer Name: " + customerName, normalFont));
            document.add(new Paragraph("Customer Email: " + (event.getUserEmail() != null ? event.getUserEmail() : "N/A"), normalFont));
            if (event.getUserId() != null && !event.getUserId().isBlank()) {
                document.add(new Paragraph("Customer ID: " + event.getUserId(), normalFont));
            }
            
            Paragraph spacing = new Paragraph(" ");
            spacing.setSpacingAfter(15);
            document.add(spacing);

            // Items Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{4.5f, 1f, 2f, 2f});
            
            // Table Header
            String[] headers = {"Product Name", "Qty", "Unit Price", "Subtotal"};
            for (String headerTitle : headers) {
                PdfPCell header = new PdfPCell();
                header.setBackgroundColor(Color.LIGHT_GRAY);
                header.setPadding(6);
                header.setPhrase(new Phrase(headerTitle, headerFont));
                table.addCell(header);
            }

            // Table Rows
            BigDecimal calculatedTotal = BigDecimal.ZERO;
            if (event.getItems() != null) {
                for (OrderItemDTO item : event.getItems()) {
                    String productName = (item.getProductName() != null && !item.getProductName().isBlank())
                            ? item.getProductName()
                            : ("Product #" + item.getProductId());
                    table.addCell(new Phrase(productName, normalFont));
                    table.addCell(new Phrase(String.valueOf(item.getQuantity()), normalFont));
                    table.addCell(new Phrase("INR " + item.getPrice(), normalFont));
                    
                    BigDecimal subTotal = item.getSubTotal() != null 
                        ? item.getSubTotal() 
                        : item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                    table.addCell(new Phrase("INR " + subTotal, normalFont));
                    calculatedTotal = calculatedTotal.add(subTotal);
                }
            }
            
            document.add(table);
            
            // Subtotal, Discount, Shipping & Total Amount
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

            Paragraph subtotalPara = new Paragraph("Subtotal: INR " + String.format("%.2f", subTotalAmount), normalFont);
            subtotalPara.setAlignment(Paragraph.ALIGN_RIGHT);
            subtotalPara.setSpacingBefore(15);
            document.add(subtotalPara);

            if (discountAmount.compareTo(BigDecimal.ZERO) > 0) {
                String couponLabel = (event.getCouponCode() != null && !event.getCouponCode().isBlank())
                        ? "Coupon Discount (" + event.getCouponCode() + "): -INR " + String.format("%.2f", discountAmount)
                        : "Coupon Discount: -INR " + String.format("%.2f", discountAmount);
                Paragraph discountPara = new Paragraph(couponLabel, normalFont);
                discountPara.setAlignment(Paragraph.ALIGN_RIGHT);
                document.add(discountPara);
            }

            String shippingText = isFreeShipping ? "Shipping: FREE (Orders >= INR 499)" : "Shipping: INR " + String.format("%.2f", shippingFee);
            Paragraph shippingPara = new Paragraph(shippingText, normalFont);
            shippingPara.setAlignment(Paragraph.ALIGN_RIGHT);
            document.add(shippingPara);

            Paragraph total = new Paragraph("Total Amount: INR " + String.format("%.2f", grandTotal), headerFont);
            total.setAlignment(Paragraph.ALIGN_RIGHT);
            total.setSpacingBefore(5);
            document.add(total);

            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate invoice for order {}: {}", event.getOrderId(), e.getMessage());
            return new byte[0];
        }
    }
}

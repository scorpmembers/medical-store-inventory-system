package com.medstore.dto;

import com.medstore.model.Sale;
import com.medstore.model.SaleItem;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record SaleResponse(
        Long id,
        String invoiceNumber,
        String customerName,
        String customerPhone,
        String doctorName,
        String paymentMethod,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal tax,
        BigDecimal grandTotal,
        LocalDate saleDate,
        String saleTime,
        List<ItemResponse> items,
        LocalDateTime createdAt
) {
    public static SaleResponse from(Sale sale) {
        List<ItemResponse> items = sale.getItems() == null
                ? List.of()
                : sale.getItems().stream().map(ItemResponse::from).toList();

        return new SaleResponse(
                sale.getId(),
                sale.getInvoiceNumber(),
                sale.getCustomerName(),
                sale.getCustomerPhone(),
                sale.getDoctorName(),
                sale.getPaymentMethod(),
                sale.getSubtotal(),
                sale.getDiscount(),
                sale.getTax(),
                sale.getGrandTotal(),
                sale.getSaleDate(),
                sale.getSaleTime(),
                items,
                sale.getCreatedAt()
        );
    }

    public record ItemResponse(
            Long id,
            String medicineName,
            String batchNumber,
            int quantity,
            BigDecimal unitPrice,
            BigDecimal totalPrice
    ) {
        private static ItemResponse from(SaleItem item) {
            return new ItemResponse(
                    item.getId(),
                    item.getMedicineName(),
                    item.getBatchNumber(),
                    item.getQuantity(),
                    item.getUnitPrice(),
                    item.getTotalPrice()
            );
        }
    }
}

package com.medstore.dto;

import com.medstore.model.Purchase;
import com.medstore.model.PurchaseItem;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PurchaseResponse(
        Long id,
        String purchaseCode,
        String invoiceNumber,
        String supplierName,
        BigDecimal totalAmount,
        LocalDate purchaseDate,
        String status,
        List<ItemResponse> items,
        LocalDateTime createdAt
) {
    public static PurchaseResponse from(Purchase purchase) {
        List<ItemResponse> items = purchase.getItems() == null
                ? List.of()
                : purchase.getItems().stream().map(ItemResponse::from).toList();

        return new PurchaseResponse(
                purchase.getId(),
                purchase.getPurchaseCode(),
                purchase.getInvoiceNumber(),
                purchase.getSupplierName(),
                purchase.getTotalAmount(),
                purchase.getPurchaseDate(),
                purchase.getStatus(),
                items,
                purchase.getCreatedAt()
        );
    }

    public record ItemResponse(
            Long id,
            String medicineName,
            String batchNumber,
            int quantity,
            BigDecimal purchasePrice,
            BigDecimal sellingPrice,
            LocalDate expiryDate,
            BigDecimal totalCost
    ) {
        private static ItemResponse from(PurchaseItem item) {
            return new ItemResponse(
                    item.getId(),
                    item.getMedicineName(),
                    item.getBatchNumber(),
                    item.getQuantity(),
                    item.getPurchasePrice(),
                    item.getSellingPrice(),
                    item.getExpiryDate(),
                    item.getTotalCost()
            );
        }
    }
}

package com.medstore.dto;

import com.medstore.model.Batch;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record BatchResponse(
        Long id,
        MedicineSummary medicine,
        String batchNumber,
        int quantity,
        BigDecimal purchasePrice,
        BigDecimal sellingPrice,
        LocalDate mfgDate,
        LocalDate expiryDate,
        String supplierName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static BatchResponse from(Batch batch) {
        MedicineSummary medicine = batch.getMedicine() == null
                ? null
                : new MedicineSummary(batch.getMedicine().getId(), batch.getMedicine().getName());

        return new BatchResponse(
                batch.getId(),
                medicine,
                batch.getBatchNumber(),
                batch.getQuantity(),
                batch.getPurchasePrice(),
                batch.getSellingPrice(),
                batch.getMfgDate(),
                batch.getExpiryDate(),
                batch.getSupplierName(),
                batch.getCreatedAt(),
                batch.getUpdatedAt()
        );
    }

    public record MedicineSummary(Long id, String name) {
    }
}

package com.medstore.dto;

import com.medstore.model.Supplier;

import java.time.LocalDateTime;

public record SupplierResponse(
        Long id,
        String name,
        String contactPerson,
        String phone,
        String email,
        String address,
        String gstin,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static SupplierResponse from(Supplier supplier) {
        return new SupplierResponse(
                supplier.getId(),
                supplier.getName(),
                supplier.getContactPerson(),
                supplier.getPhone(),
                supplier.getEmail(),
                supplier.getAddress(),
                supplier.getGstin(),
                supplier.getStatus(),
                supplier.getCreatedAt(),
                supplier.getUpdatedAt()
        );
    }
}

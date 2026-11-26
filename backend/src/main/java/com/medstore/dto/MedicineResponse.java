package com.medstore.dto;

import com.medstore.model.Medicine;

import java.time.LocalDateTime;

public record MedicineResponse(
        Long id,
        String name,
        String genericName,
        String category,
        String dosage,
        String rackLocation,
        String unit,
        int minStockAlert,
        String manufacturer,
        String description,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static MedicineResponse from(Medicine medicine) {
        return new MedicineResponse(
                medicine.getId(),
                medicine.getName(),
                medicine.getGenericName(),
                medicine.getCategory(),
                medicine.getDosage(),
                medicine.getRackLocation(),
                medicine.getUnit(),
                medicine.getMinStockAlert(),
                medicine.getManufacturer(),
                medicine.getDescription(),
                medicine.isActive(),
                medicine.getCreatedAt(),
                medicine.getUpdatedAt()
        );
    }
}

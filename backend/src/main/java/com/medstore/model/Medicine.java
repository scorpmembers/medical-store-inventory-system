package com.medstore.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicines", indexes = {
    @Index(name = "idx_medicines_store", columnList = "store_id"),
    @Index(name = "idx_medicines_name", columnList = "name"),
    @Index(name = "idx_medicines_category", columnList = "category")
})
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "generic_name", length = 150)
    private String genericName;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(length = 50)
    private String dosage; // e.g. Tablet, Syrup, Capsule

    @Column(name = "rack_location", length = 50)
    private String rackLocation;

    @Column(length = 50)
    private String unit; // e.g. Strip (10 tabs), Bottle

    @Column(name = "min_stock_alert", nullable = false)
    private int minStockAlert = 15;

    @Column(length = 100)
    private String manufacturer;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Medicine() {
    }

    public Medicine(Store store, String name, String genericName, String category, String dosage,
                    String rackLocation, String unit, int minStockAlert, String manufacturer, String description) {
        this.store = store;
        this.name = name;
        this.genericName = genericName;
        this.category = category;
        this.dosage = dosage;
        this.rackLocation = rackLocation;
        this.unit = unit;
        this.minStockAlert = minStockAlert;
        this.manufacturer = manufacturer;
        this.description = description;
        this.active = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getRackLocation() {
        return rackLocation;
    }

    public void setRackLocation(String rackLocation) {
        this.rackLocation = rackLocation;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public int getMinStockAlert() {
        return minStockAlert;
    }

    public void setMinStockAlert(int minStockAlert) {
        this.minStockAlert = minStockAlert;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

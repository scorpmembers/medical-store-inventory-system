package com.medstore.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stores", indexes = {
    @Index(name = "idx_stores_email", columnList = "email"),
    @Index(name = "idx_stores_phone", columnList = "phone")
})
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "store_name", nullable = false, length = 150)
    private String storeName;

    @Column(name = "owner_name", nullable = false, length = 100)
    private String ownerName;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(length = 120)
    private String email;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 80)
    private String city;

    @Column(nullable = false, length = 80)
    private String state;

    @Column(nullable = false, length = 12)
    private String pincode;

    @Column(length = 20)
    private String gstin;

    @Column(name = "drug_license_number", length = 50)
    private String drugLicenseNumber;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Store() {
    }

    public Store(String storeName, String ownerName, String phone, String email, String address,
                 String city, String state, String pincode, String gstin, String drugLicenseNumber) {
        this.storeName = storeName;
        this.ownerName = ownerName;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.gstin = gstin;
        this.drugLicenseNumber = drugLicenseNumber;
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

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public String getDrugLicenseNumber() {
        return drugLicenseNumber;
    }

    public void setDrugLicenseNumber(String drugLicenseNumber) {
        this.drugLicenseNumber = drugLicenseNumber;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
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

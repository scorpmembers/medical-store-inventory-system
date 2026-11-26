package com.medstore.dto;

import com.medstore.model.Store;
import java.time.LocalDateTime;

public class StoreProfileDto {

    private Long id;
    private String storeName;
    private String ownerName;
    private String phone;
    private String email;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String gstin;
    private String drugLicenseNumber;
    private String logoUrl;
    private boolean active;
    private LocalDateTime createdAt;

    public StoreProfileDto() {
    }

    public StoreProfileDto(Store store) {
        this.id = store.getId();
        this.storeName = store.getStoreName();
        this.ownerName = store.getOwnerName();
        this.phone = store.getPhone();
        this.email = store.getEmail();
        this.address = store.getAddress();
        this.city = store.getCity();
        this.state = store.getState();
        this.pincode = store.getPincode();
        this.gstin = store.getGstin();
        this.drugLicenseNumber = store.getDrugLicenseNumber();
        this.logoUrl = store.getLogoUrl();
        this.active = store.isActive();
        this.createdAt = store.getCreatedAt();
    }

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
}

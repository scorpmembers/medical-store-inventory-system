package com.medstore.dto;

import com.medstore.model.Role;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private Long storeId;
    private String storeName;
    private String drugLicenseNumber;
    private String address;
    private String gstin;
    private String message;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long id, String name, String email, String phone, Role role,
                        Long storeId, String storeName, String drugLicenseNumber, String address,
                        String gstin, String message) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.storeId = storeId;
        this.storeName = storeName;
        this.drugLicenseNumber = drugLicenseNumber;
        this.address = address;
        this.gstin = gstin;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Long getStoreId() {
        return storeId;
    }

    public void setStoreId(Long storeId) {
        this.storeId = storeId;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getDrugLicenseNumber() {
        return drugLicenseNumber;
    }

    public void setDrugLicenseNumber(String drugLicenseNumber) {
        this.drugLicenseNumber = drugLicenseNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

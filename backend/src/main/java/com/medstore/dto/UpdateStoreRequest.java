package com.medstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateStoreRequest {

    @NotBlank(message = "Store owner name is required")
    @Size(min = 2, max = 100, message = "Owner name must be between 2 and 100 characters")
    private String ownerName;

    @NotBlank(message = "Medical store name is required")
    @Size(min = 2, max = 150, message = "Medical store name must be between 2 and 150 characters")
    private String storeName;

    @NotBlank(message = "Store contact phone is required")
    @Pattern(regexp = "^[0-9+()\\- ]{7,20}$", message = "Store contact number must be a valid phone number")
    private String phone;

    @Email(message = "Store email must be a valid email address if provided")
    private String email;

    @NotBlank(message = "Store address is required")
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    @NotBlank(message = "City is required")
    @Size(max = 80, message = "City cannot exceed 80 characters")
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 80, message = "State cannot exceed 80 characters")
    private String state;

    @NotBlank(message = "PIN code is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "PIN code must be a 6-digit number")
    private String pincode;

    @Pattern(regexp = "^$|(?i)^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$", message = "GSTIN format is invalid")
    private String gstin;

    private String drugLicenseNumber;

    private String logoUrl;

    public UpdateStoreRequest() {
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
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
}

package com.medstore.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "purchase_items", indexes = {
    @Index(name = "idx_purchase_items_purchase", columnList = "purchase_id")
})
public class PurchaseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_id", nullable = false)
    @JsonIgnore
    private Purchase purchase;

    @Column(name = "medicine_name", nullable = false, length = 150)
    private String medicineName;

    @Column(name = "batch_number", nullable = false, length = 50)
    private String batchNumber;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "purchase_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "selling_price", precision = 10, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "total_cost", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalCost;

    public PurchaseItem() {
    }

    public PurchaseItem(Purchase purchase, String medicineName, String batchNumber, int quantity,
                        BigDecimal purchasePrice, BigDecimal sellingPrice, LocalDate expiryDate, BigDecimal totalCost) {
        this.purchase = purchase;
        this.medicineName = medicineName;
        this.batchNumber = batchNumber;
        this.quantity = quantity;
        this.purchasePrice = purchasePrice;
        this.sellingPrice = sellingPrice;
        this.expiryDate = expiryDate;
        this.totalCost = totalCost;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Purchase getPurchase() {
        return purchase;
    }

    public void setPurchase(Purchase purchase) {
        this.purchase = purchase;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }
}

package com.medstore.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchases", indexes = {
    @Index(name = "idx_purchases_store", columnList = "store_id"),
    @Index(name = "idx_purchases_invoice", columnList = "invoice_number")
})
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "purchase_code", nullable = false, length = 50)
    private String purchaseCode;

    @Column(name = "invoice_number", length = 80)
    private String invoiceNumber;

    @Column(name = "supplier_name", nullable = false, length = 120)
    private String supplierName;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(nullable = false, length = 30)
    private String status = "Received";

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Purchase() {
    }

    public Purchase(Store store, String purchaseCode, String invoiceNumber, String supplierName,
                    BigDecimal totalAmount, LocalDate purchaseDate) {
        this.store = store;
        this.purchaseCode = purchaseCode;
        this.invoiceNumber = invoiceNumber;
        this.supplierName = supplierName;
        this.totalAmount = totalAmount;
        this.purchaseDate = purchaseDate;
        this.status = "Received";
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
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

    public String getPurchaseCode() {
        return purchaseCode;
    }

    public void setPurchaseCode(String purchaseCode) {
        this.purchaseCode = purchaseCode;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<PurchaseItem> getItems() {
        return items;
    }

    public void setItems(List<PurchaseItem> items) {
        this.items = items;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

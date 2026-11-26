package com.medstore.service;

import com.medstore.model.*;
import com.medstore.repository.BatchRepository;
import com.medstore.repository.SaleRepository;
import com.medstore.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public List<Sale> getAllSales(Long storeId) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");
        return saleRepository.findByStoreIdOrderBySaleDateDesc(storeId);
    }

    @Transactional(readOnly = true)
    public Sale getSaleById(Long id, Long storeId) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");
        return saleRepository.findByIdAndStoreId(id, storeId)
                .orElseThrow(() -> new IllegalArgumentException("Sale record with ID " + id + " not found in your store."));
    }

    /**
     * Creates a new sale with strict validation:
     * - Validates batch exists in the user's store.
     * - Blocks sales of expired medicine batches.
     * - Blocks sales when requested quantity exceeds available stock.
     * - Decrements batch inventory in the same transaction.
     */
    @Transactional
    public Sale createSale(Long storeId, Sale sale) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");

        Store store = storeRepository.findByIdAndActiveTrue(storeId)
                .orElseThrow(() -> new IllegalArgumentException("Store not found: " + storeId));

        sale.setStore(store);
        if (sale.getSaleDate() == null) {
            sale.setSaleDate(LocalDate.now());
        }
        if (sale.getSaleTime() == null || sale.getSaleTime().trim().isEmpty()) {
            sale.setSaleTime(LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
        }
        if (sale.getInvoiceNumber() == null || sale.getInvoiceNumber().trim().isEmpty()) {
            sale.setInvoiceNumber("INV-" + System.currentTimeMillis());
        }

        if (sale.getItems() == null || sale.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cannot create a sale without items.");
        }

        for (SaleItem item : sale.getItems()) {
            item.setSale(sale);

            // Fetch and validate batch in this specific store
            Batch batch = batchRepository.findByStoreIdAndBatchNumber(storeId, item.getBatchNumber())
                    .orElseThrow(() -> new IllegalArgumentException("Batch '" + item.getBatchNumber() + "' does not exist in your store inventory."));

            // Check expiry
            if (batch.getExpiryDate() != null && batch.getExpiryDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Cannot sell expired medicine: Batch " + batch.getBatchNumber() + " expired on " + batch.getExpiryDate());
            }

            // Check stock availability
            if (batch.getQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for batch " + batch.getBatchNumber() + ". Requested: " + item.getQuantity() + ", Available: " + batch.getQuantity());
            }

            // Decrement inventory
            batch.setQuantity(batch.getQuantity() - item.getQuantity());
            batchRepository.save(batch);
        }

        return saleRepository.save(sale);
    }
}

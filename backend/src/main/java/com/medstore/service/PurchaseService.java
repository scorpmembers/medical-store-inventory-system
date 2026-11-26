package com.medstore.service;

import com.medstore.model.*;
import com.medstore.repository.BatchRepository;
import com.medstore.repository.MedicineRepository;
import com.medstore.repository.PurchaseRepository;
import com.medstore.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public List<Purchase> getAllPurchases(Long storeId) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");
        return purchaseRepository.findByStoreIdOrderByPurchaseDateDesc(storeId);
    }

    @Transactional(readOnly = true)
    public Purchase getPurchaseById(Long id, Long storeId) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");
        return purchaseRepository.findByIdAndStoreId(id, storeId)
                .orElseThrow(() -> new IllegalArgumentException("Purchase record with ID " + id + " not found in your store."));
    }

    @Transactional
    public Purchase createPurchase(Long storeId, Purchase purchase) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");

        Store store = storeRepository.findByIdAndActiveTrue(storeId)
                .orElseThrow(() -> new IllegalArgumentException("Store not found: " + storeId));

        purchase.setStore(store);
        if (purchase.getPurchaseDate() == null) {
            purchase.setPurchaseDate(LocalDate.now());
        }
        if (purchase.getPurchaseCode() == null || purchase.getPurchaseCode().trim().isEmpty()) {
            purchase.setPurchaseCode("PUR-" + System.currentTimeMillis());
        }

        // Link items and update/create batches
        if (purchase.getItems() != null) {
            for (PurchaseItem item : purchase.getItems()) {
                item.setPurchase(purchase);

                // Update inventory batch or create new batch for this store
                Optional<Batch> existingBatchOpt = batchRepository.findByStoreIdAndBatchNumber(storeId, item.getBatchNumber());
                if (existingBatchOpt.isPresent()) {
                    Batch existingBatch = existingBatchOpt.get();
                    existingBatch.setQuantity(existingBatch.getQuantity() + item.getQuantity());
                    if (item.getPurchasePrice() != null) {
                        existingBatch.setPurchasePrice(item.getPurchasePrice());
                    }
                    if (item.getSellingPrice() != null) {
                        existingBatch.setSellingPrice(item.getSellingPrice());
                    }
                    if (item.getExpiryDate() != null) {
                        existingBatch.setExpiryDate(item.getExpiryDate());
                    }
                    batchRepository.save(existingBatch);
                } else {
                    // Find or create medicine
                    List<Medicine> medicines = medicineRepository.findByStoreIdAndActiveTrueOrderByNameAsc(storeId);
                    Medicine matchedMedicine = medicines.stream()
                            .filter(m -> m.getName().equalsIgnoreCase(item.getMedicineName()))
                            .findFirst()
                            .orElseGet(() -> {
                                Medicine newMed = new Medicine();
                                newMed.setStore(store);
                                newMed.setName(item.getMedicineName());
                                newMed.setCategory("General");
                                newMed.setMinStockAlert(15);
                                newMed.setActive(true);
                                return medicineRepository.save(newMed);
                            });

                    Batch newBatch = new Batch();
                    newBatch.setStore(store);
                    newBatch.setMedicine(matchedMedicine);
                    newBatch.setBatchNumber(item.getBatchNumber());
                    newBatch.setQuantity(item.getQuantity());
                    newBatch.setPurchasePrice(item.getPurchasePrice() != null ? item.getPurchasePrice() : BigDecimal.ZERO);
                    newBatch.setSellingPrice(item.getSellingPrice() != null ? item.getSellingPrice() : BigDecimal.ZERO);
                    newBatch.setMfgDate(LocalDate.now());
                    newBatch.setExpiryDate(item.getExpiryDate() != null ? item.getExpiryDate() : LocalDate.now().plusYears(2));
                    newBatch.setSupplierName(purchase.getSupplierName());
                    batchRepository.save(newBatch);
                }
            }
        }

        return purchaseRepository.save(purchase);
    }
}

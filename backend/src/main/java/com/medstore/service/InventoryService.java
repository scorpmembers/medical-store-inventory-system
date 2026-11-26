package com.medstore.service;

import com.medstore.model.Batch;
import com.medstore.model.Medicine;
import com.medstore.model.Store;
import com.medstore.repository.BatchRepository;
import com.medstore.repository.MedicineRepository;
import com.medstore.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public List<Batch> getAllBatches(Long storeId) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");
        return batchRepository.findByStoreIdOrderByExpiryDateAsc(storeId);
    }

    @Transactional(readOnly = true)
    public List<Batch> getBatchesByMedicine(Long storeId, Long medicineId) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");
        return batchRepository.findByStoreIdAndMedicineId(storeId, medicineId);
    }

    @Transactional(readOnly = true)
    public Batch getBatchById(Long id, Long storeId) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");
        return batchRepository.findByIdAndStoreId(id, storeId)
                .orElseThrow(() -> new IllegalArgumentException("Batch with ID " + id + " not found in your store."));
    }

    @Transactional
    public Batch addBatch(Long storeId, Long medicineId, Batch batch) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");

        Store store = storeRepository.findByIdAndActiveTrue(storeId)
                .orElseThrow(() -> new IllegalArgumentException("Store not found: " + storeId));

        Medicine medicine = medicineRepository.findByIdAndStoreId(medicineId, storeId)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found in your store: " + medicineId));

        batch.setStore(store);
        batch.setMedicine(medicine);
        return batchRepository.save(batch);
    }

    @Transactional
    public Batch updateBatch(Long id, Long storeId, Batch details) {
        Batch batch = getBatchById(id, storeId);

        batch.setBatchNumber(details.getBatchNumber());
        batch.setQuantity(details.getQuantity());
        batch.setPurchasePrice(details.getPurchasePrice());
        batch.setSellingPrice(details.getSellingPrice());
        batch.setMfgDate(details.getMfgDate());
        batch.setExpiryDate(details.getExpiryDate());
        batch.setSupplierName(details.getSupplierName());

        return batchRepository.save(batch);
    }

    @Transactional
    public void deleteBatch(Long id, Long storeId) {
        Batch batch = getBatchById(id, storeId);
        batchRepository.delete(batch);
    }
}

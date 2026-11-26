package com.medstore.service;

import com.medstore.model.Store;
import com.medstore.model.Supplier;
import com.medstore.repository.StoreRepository;
import com.medstore.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public List<Supplier> getAllSuppliers(Long storeId) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");
        return supplierRepository.findByStoreIdOrderByNameAsc(storeId);
    }

    @Transactional(readOnly = true)
    public Supplier getSupplierById(Long id, Long storeId) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");
        return supplierRepository.findByIdAndStoreId(id, storeId)
                .orElseThrow(() -> new IllegalArgumentException("Supplier with ID " + id + " not found in your store."));
    }

    @Transactional
    public Supplier createSupplier(Long storeId, Supplier supplier) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");

        Store store = storeRepository.findByIdAndActiveTrue(storeId)
                .orElseThrow(() -> new IllegalArgumentException("Store not found: " + storeId));

        supplier.setStore(store);
        return supplierRepository.save(supplier);
    }

    @Transactional
    public Supplier updateSupplier(Long id, Long storeId, Supplier details) {
        Supplier supplier = getSupplierById(id, storeId);

        supplier.setName(details.getName());
        supplier.setContactPerson(details.getContactPerson());
        supplier.setPhone(details.getPhone());
        supplier.setEmail(details.getEmail());
        supplier.setAddress(details.getAddress());
        supplier.setGstin(details.getGstin());
        supplier.setStatus(details.getStatus());

        return supplierRepository.save(supplier);
    }

    @Transactional
    public void deleteSupplier(Long id, Long storeId) {
        Supplier supplier = getSupplierById(id, storeId);
        supplierRepository.delete(supplier);
    }
}

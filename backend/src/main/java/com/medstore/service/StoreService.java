package com.medstore.service;

import com.medstore.dto.StoreProfileDto;
import com.medstore.dto.UpdateStoreRequest;
import com.medstore.model.Store;
import com.medstore.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StoreService {

    @Autowired
    private StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public StoreProfileDto getStoreProfile(Long storeId) {
        if (storeId == null) {
            throw new IllegalArgumentException("Tenant store ID is missing.");
        }
        Store store = storeRepository.findByIdAndActiveTrue(storeId)
                .orElseThrow(() -> new IllegalArgumentException("Store profile not found or inactive for ID: " + storeId));
        return new StoreProfileDto(store);
    }

    @Transactional
    public StoreProfileDto updateStoreProfile(Long storeId, UpdateStoreRequest request) {
        if (storeId == null) {
            throw new IllegalArgumentException("Tenant store ID is missing.");
        }
        Store store = storeRepository.findByIdAndActiveTrue(storeId)
                .orElseThrow(() -> new IllegalArgumentException("Store profile not found or inactive for ID: " + storeId));

        store.setOwnerName(request.getOwnerName().trim());
        store.setStoreName(request.getStoreName().trim());
        store.setPhone(request.getPhone().trim());
        store.setEmail(request.getEmail() != null && !request.getEmail().trim().isEmpty()
                ? request.getEmail().trim().toLowerCase()
                : null);
        store.setAddress(request.getAddress().trim());
        store.setCity(request.getCity().trim());
        store.setState(request.getState().trim());
        store.setPincode(request.getPincode().trim());
        store.setGstin(request.getGstin() != null ? request.getGstin().trim().toUpperCase() : null);
        store.setDrugLicenseNumber(request.getDrugLicenseNumber() != null ? request.getDrugLicenseNumber().trim() : null);
        store.setLogoUrl(request.getLogoUrl() != null ? request.getLogoUrl().trim() : null);

        Store updated = storeRepository.save(store);
        return new StoreProfileDto(updated);
    }
}

package com.medstore.service;

import com.medstore.model.Medicine;
import com.medstore.model.Store;
import com.medstore.repository.MedicineRepository;
import com.medstore.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public List<Medicine> getAllMedicines(Long storeId) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");
        return medicineRepository.findByStoreIdAndActiveTrueOrderByNameAsc(storeId);
    }

    @Transactional(readOnly = true)
    public Medicine getMedicineById(Long id, Long storeId) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");
        return medicineRepository.findByIdAndStoreId(id, storeId)
                .orElseThrow(() -> new IllegalArgumentException("Medicine with ID " + id + " not found in your store."));
    }

    @Transactional
    public Medicine createMedicine(Long storeId, Medicine medicine) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");

        Store store = storeRepository.findByIdAndActiveTrue(storeId)
                .orElseThrow(() -> new IllegalArgumentException("Store not found: " + storeId));

        medicine.setStore(store);
        medicine.setActive(true);
        return medicineRepository.save(medicine);
    }

    @Transactional
    public Medicine updateMedicine(Long id, Long storeId, Medicine details) {
        Medicine medicine = getMedicineById(id, storeId);

        medicine.setName(details.getName());
        medicine.setGenericName(details.getGenericName());
        medicine.setCategory(details.getCategory());
        medicine.setDosage(details.getDosage());
        medicine.setRackLocation(details.getRackLocation());
        medicine.setUnit(details.getUnit());
        medicine.setMinStockAlert(details.getMinStockAlert());
        medicine.setManufacturer(details.getManufacturer());
        medicine.setDescription(details.getDescription());

        return medicineRepository.save(medicine);
    }

    @Transactional
    public void deleteMedicine(Long id, Long storeId) {
        Medicine medicine = getMedicineById(id, storeId);
        medicine.setActive(false);
        medicineRepository.save(medicine);
    }
}

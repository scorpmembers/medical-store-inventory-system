package com.medstore.repository;

import com.medstore.model.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {

    List<Batch> findByStoreIdOrderByExpiryDateAsc(Long storeId);

    List<Batch> findByStoreIdAndMedicineId(Long storeId, Long medicineId);

    Optional<Batch> findByStoreIdAndBatchNumber(Long storeId, String batchNumber);

    Optional<Batch> findByIdAndStoreId(Long id, Long storeId);

    List<Batch> findByStoreIdAndExpiryDateLessThanEqual(Long storeId, LocalDate date);

    List<Batch> findByStoreIdAndQuantityLessThanEqual(Long storeId, int quantity);
}

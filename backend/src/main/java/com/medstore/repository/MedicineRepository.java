package com.medstore.repository;

import com.medstore.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByStoreIdAndActiveTrueOrderByNameAsc(Long storeId);

    Optional<Medicine> findByIdAndStoreId(Long id, Long storeId);

    List<Medicine> findByStoreIdAndCategoryAndActiveTrue(Long storeId, String category);

    boolean existsByStoreIdAndNameIgnoreCase(Long storeId, String name);

    long countByStoreIdAndActiveTrue(Long storeId);
}

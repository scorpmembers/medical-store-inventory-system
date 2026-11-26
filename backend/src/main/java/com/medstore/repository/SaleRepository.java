package com.medstore.repository;

import com.medstore.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findByStoreIdOrderBySaleDateDesc(Long storeId);

    Optional<Sale> findByIdAndStoreId(Long id, Long storeId);

    List<Sale> findByStoreIdAndSaleDate(Long storeId, LocalDate date);

    long countByStoreIdAndSaleDate(Long storeId, LocalDate date);

    long countByStoreId(Long storeId);
}

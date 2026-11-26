package com.medstore.repository;

import com.medstore.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    List<Purchase> findByStoreIdOrderByPurchaseDateDesc(Long storeId);

    Optional<Purchase> findByIdAndStoreId(Long id, Long storeId);

    long countByStoreId(Long storeId);
}

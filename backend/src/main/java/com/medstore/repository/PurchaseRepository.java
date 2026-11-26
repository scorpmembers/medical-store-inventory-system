package com.medstore.repository;

import com.medstore.model.Purchase;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    @EntityGraph(attributePaths = "items")
    List<Purchase> findByStoreIdOrderByPurchaseDateDesc(Long storeId);

    @EntityGraph(attributePaths = "items")
    Optional<Purchase> findByIdAndStoreId(Long id, Long storeId);

    long countByStoreId(Long storeId);
}

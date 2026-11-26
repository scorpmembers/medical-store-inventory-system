package com.medstore.repository;

import com.medstore.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {

    Optional<Store> findByIdAndActiveTrue(Long id);

    Boolean existsByEmail(String email);

    Boolean existsByPhone(String phone);
}

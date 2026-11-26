package com.medstore.repository;

import com.medstore.model.Role;
import com.medstore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    List<User> findByStoreId(Long storeId);

    List<User> findByStoreIdAndRole(Long storeId, Role role);

    Optional<User> findByIdAndStoreId(Long id, Long storeId);

    long countByStoreIdAndRole(Long storeId, Role role);

    long countByRole(Role role);
}

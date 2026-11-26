package com.medstore.service;

import com.medstore.dto.CreateStaffRequest;
import com.medstore.dto.UserDto;
import com.medstore.model.Role;
import com.medstore.model.Store;
import com.medstore.model.User;
import com.medstore.repository.StoreRepository;
import com.medstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserDto> getStaffByStore(Long storeId) {
        if (storeId == null) {
            throw new IllegalArgumentException("Store ID is required to fetch staff.");
        }
        return userRepository.findByStoreIdAndRole(storeId, Role.ROLE_STAFF).stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto createStaffByAdmin(Long storeId, CreateStaffRequest request) {
        if (storeId == null) {
            throw new IllegalArgumentException("Store ID is required to create staff.");
        }

        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email '" + email + "' is already registered in the system.");
        }

        Store store = storeRepository.findByIdAndActiveTrue(storeId)
                .orElseThrow(() -> new IllegalArgumentException("Store with ID " + storeId + " not found or inactive."));

        User staff = new User();
        staff.setName(request.getName().trim());
        staff.setEmail(email);
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        staff.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        staff.setRole(Role.ROLE_STAFF);
        staff.setStore(store);
        staff.setActive(true);

        User saved = userRepository.save(staff);
        return new UserDto(saved);
    }

    @Transactional
    public UserDto toggleStaffStatus(Long staffId, Long storeId, String currentAdminEmail) {
        if (storeId == null) {
            throw new IllegalArgumentException("Store ID is required.");
        }

        User user = userRepository.findByIdAndStoreId(staffId, storeId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + staffId + " not found in your medical store."));

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new IllegalArgumentException("Administrator cannot deactivate their own active account.");
        }

        user.setActive(!user.isActive());
        User updated = userRepository.save(user);
        return new UserDto(updated);
    }

    @Transactional
    public void deleteStaff(Long staffId, Long storeId, String currentAdminEmail) {
        if (storeId == null) {
            throw new IllegalArgumentException("Store ID is required.");
        }

        User user = userRepository.findByIdAndStoreId(staffId, storeId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + staffId + " not found in your medical store."));

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new IllegalArgumentException("Administrator cannot delete their own account.");
        }

        if (user.getRole() == Role.ROLE_ADMIN) {
            throw new IllegalArgumentException("Cannot delete another Administrator account through this endpoint.");
        }

        userRepository.delete(user);
    }
}

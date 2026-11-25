package com.medstore.service;

import com.medstore.dto.CreateStaffRequest;
import com.medstore.dto.UserDto;
import com.medstore.model.Role;
import com.medstore.model.User;
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
    private PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllStaff() {
        return userRepository.findByRole(Role.ROLE_STAFF).stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto createStaffByAdmin(CreateStaffRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email '" + email + "' is already registered in the system.");
        }

        User staff = new User();
        staff.setName(request.getName().trim());
        staff.setEmail(email);
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        staff.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        staff.setRole(Role.ROLE_STAFF);
        staff.setActive(true);

        User saved = userRepository.save(staff);
        return new UserDto(saved);
    }

    @Transactional
    public UserDto toggleStaffStatus(Long id, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + id + " not found."));

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new IllegalArgumentException("Administrator cannot deactivate their own active account.");
        }

        user.setActive(!user.isActive());
        User updated = userRepository.save(user);
        return new UserDto(updated);
    }

    @Transactional
    public void deleteStaff(Long id, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + id + " not found."));

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new IllegalArgumentException("Administrator cannot delete their own account.");
        }

        if (user.getRole() == Role.ROLE_ADMIN) {
            throw new IllegalArgumentException("Cannot delete another Administrator account through this endpoint.");
        }

        userRepository.delete(user);
    }
}

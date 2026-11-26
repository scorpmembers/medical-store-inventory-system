package com.medstore.service;

import com.medstore.dto.AuthResponse;
import com.medstore.dto.LoginRequest;
import com.medstore.dto.RegisterStoreRequest;
import com.medstore.dto.SignupRequest;
import com.medstore.model.Role;
import com.medstore.model.Store;
import com.medstore.model.User;
import com.medstore.repository.StoreRepository;
import com.medstore.repository.UserRepository;
import com.medstore.security.CustomUserDetails;
import com.medstore.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Multi-Tenant Store & Admin Registration:
     * In a single atomic database transaction:
     * 1. Creates a new Store record in the 'stores' table.
     * 2. Creates the Owner/Admin account in 'users' with ROLE_ADMIN and store_id FK.
     * 3. Generates a JWT containing tenant claims (storeId, storeName).
     */
    @Transactional
    public AuthResponse registerStore(RegisterStoreRequest request) {
        String ownerEmail = request.getEmail().toLowerCase().trim();
        String storeEmail = request.getStoreEmail() != null && !request.getStoreEmail().trim().isEmpty()
                ? request.getStoreEmail().toLowerCase().trim()
                : ownerEmail;

        // 1. Validate password match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and Confirm Password do not match.");
        }

        // 2. Prevent duplicate user email
        if (userRepository.existsByEmail(ownerEmail)) {
            throw new IllegalArgumentException("Account with email '" + ownerEmail + "' already exists. Please log in.");
        }

        // 3. Create Store Entity
        Store store = new Store();
        store.setStoreName(request.getStoreName().trim());
        store.setOwnerName(request.getOwnerName().trim());
        store.setPhone(request.getStorePhone() != null && !request.getStorePhone().trim().isEmpty()
                ? request.getStorePhone().trim()
                : request.getPhone().trim());
        store.setEmail(storeEmail);
        store.setAddress(request.getAddress().trim());
        store.setCity(request.getCity().trim());
        store.setState(request.getState().trim());
        store.setPincode(request.getPincode().trim());
        store.setGstin(request.getGstin() != null ? request.getGstin().trim().toUpperCase() : null);
        store.setDrugLicenseNumber(request.getDrugLicenseNumber() != null ? request.getDrugLicenseNumber().trim() : null);
        store.setLogoUrl(request.getLogoUrl() != null ? request.getLogoUrl().trim() : null);
        store.setActive(true);

        Store savedStore = storeRepository.save(store);

        // 4. Create Owner User Entity (strictly ROLE_ADMIN, strictly assigned to savedStore)
        User owner = new User();
        owner.setName(request.getOwnerName().trim());
        owner.setEmail(ownerEmail);
        owner.setPassword(passwordEncoder.encode(request.getPassword()));
        owner.setPhone(request.getPhone().trim());
        owner.setRole(Role.ROLE_ADMIN);
        owner.setStore(savedStore);
        owner.setActive(true);

        User savedOwner = userRepository.save(owner);

        // 5. Generate JWT token with tenant claims
        String token = jwtUtil.generateToken(
                savedOwner.getEmail(),
                savedOwner.getRole(),
                savedOwner.getName(),
                savedOwner.getId(),
                savedStore.getId(),
                savedStore.getStoreName()
        );

        return new AuthResponse(
                token,
                savedOwner.getId(),
                savedOwner.getName(),
                savedOwner.getEmail(),
                savedOwner.getPhone(),
                savedOwner.getRole(),
                savedStore.getId(),
                savedStore.getStoreName(),
                savedStore.getDrugLicenseNumber(),
                savedStore.getAddress(),
                savedStore.getGstin(),
                "Medical store '" + savedStore.getStoreName() + "' registered successfully! Welcome aboard."
        );
    }

    /**
     * Authenticate user, verify active status of both user and their store, and return JWT with tenant context.
     */
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        // 1. Check user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        // 2. Check if user is active
        if (!user.isActive()) {
            throw new BadCredentialsException("Your user account has been deactivated. Please contact your store administrator.");
        }

        // 3. Check if store is active
        if (user.getStore() != null && !user.getStore().isActive()) {
            throw new BadCredentialsException("Your medical store account has been deactivated. Please contact platform support.");
        }

        // 4. Authenticate credentials
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(authentication);

        Long storeId = userDetails.getStoreId();
        String storeName = userDetails.getStoreName();
        String drugLicense = null;
        String address = null;
        String gstin = null;

        if (userDetails.getStore() != null) {
            drugLicense = userDetails.getStore().getDrugLicenseNumber();
            address = userDetails.getStore().getAddress();
            gstin = userDetails.getStore().getGstin();
        }

        return new AuthResponse(
                token,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getUsername(),
                userDetails.getPhone(),
                userDetails.getUser().getRole(),
                storeId,
                storeName,
                drugLicense,
                address,
                gstin,
                "Login successful. Welcome back, " + userDetails.getName() + "!"
        );
    }

    /**
     * Public staff registration is disabled. Staff must be created by Admin.
     */
    public AuthResponse registerStaff(SignupRequest request) {
        throw new UnsupportedOperationException(
                "Public staff registration is disabled in multi-tenant mode. Store staff must be registered by their Store Administrator via Admin User Management."
        );
    }
}

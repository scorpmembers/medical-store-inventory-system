package com.medstore.service;

import com.medstore.dto.AuthResponse;
import com.medstore.dto.LoginRequest;
import com.medstore.dto.SignupRequest;
import com.medstore.dto.UserDto;
import com.medstore.model.Role;
import com.medstore.model.User;
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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public AuthResponse registerStaff(SignupRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        // 1. Validate password confirmation
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and Confirm Password do not match.");
        }

        // 2. Prevent duplicate email registrations
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email '" + email + "' is already registered. Please log in or use another email.");
        }

        // 3. Create new user with ROLE_STAFF (Public signup MUST NOT be able to choose Admin role!)
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        user.setRole(Role.ROLE_STAFF); // Strictly assigned
        user.setActive(true);

        User savedUser = userRepository.save(user);

        // 4. Generate JWT token for immediate access
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole(), savedUser.getName(), savedUser.getId());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getRole(),
                "Staff registration successful! Welcome to MedStore IMS."
        );
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        // Check if user exists first to give meaningful error if inactive
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        if (!user.isActive()) {
            throw new BadCredentialsException("Your account is deactivated by the Administrator. Please contact your store manager.");
        }

        // Authenticate with Spring Security AuthenticationManager
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

        return new AuthResponse(
                token,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getUsername(),
                userDetails.getPhone(),
                userDetails.getUser().getRole(),
                "Login successful. Welcome back, " + userDetails.getName() + "!"
        );
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        return new UserDto(user);
    }
}

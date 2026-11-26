package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import com.medstore.dto.AuthResponse;
import com.medstore.dto.LoginRequest;
import com.medstore.dto.RegisterStoreRequest;
import com.medstore.dto.UserDto;
import com.medstore.model.User;
import com.medstore.repository.UserRepository;
import com.medstore.security.CustomUserDetails;
import com.medstore.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Register a new Medical Store with Admin account (multi-tenant)
     */
    @PostMapping("/register-store")
    public ResponseEntity<ApiResponse<AuthResponse>> registerStore(
            @Valid @RequestBody RegisterStoreRequest request) {
        AuthResponse response = authService.registerStore(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response.getMessage(), response));
    }

    /**
     * User Login (Admin & Staff)
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
    }

    /**
     * Get Current Authenticated User Profile
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User not found"));
        }

        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", new UserDto(user)));
    }
}

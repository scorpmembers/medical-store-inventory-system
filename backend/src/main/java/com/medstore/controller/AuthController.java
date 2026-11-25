package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import com.medstore.dto.AuthResponse;
import com.medstore.dto.LoginRequest;
import com.medstore.dto.SignupRequest;
import com.medstore.dto.UserDto;
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

    /**
     * Public Staff Signup
     * Automatically assigns ROLE_STAFF. Admin accounts cannot be created publicly.
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> registerStaff(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.registerStaff(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response.getMessage(), response));
    }

    /**
     * User Login (Admin & Staff)
     * Validates credentials against MySQL and returns JWT token.
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
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        UserDto userDto = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", userDto));
    }
}

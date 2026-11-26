package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import com.medstore.dto.StoreProfileDto;
import com.medstore.dto.UpdateStoreRequest;
import com.medstore.security.CustomUserDetails;
import com.medstore.service.StoreService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    @Autowired
    private StoreService storeService;

    /**
     * Get the authenticated user's store profile (Admin & Staff can view)
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StoreProfileDto>> getStoreProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        StoreProfileDto profile = storeService.getStoreProfile(storeId);
        return ResponseEntity.ok(ApiResponse.success("Store profile retrieved successfully", profile));
    }

    /**
     * Update store profile (Admin only)
     */
    @PutMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<StoreProfileDto>> updateStoreProfile(
            @Valid @RequestBody UpdateStoreRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        StoreProfileDto updated = storeService.updateStoreProfile(storeId, request);
        return ResponseEntity.ok(ApiResponse.success("Store profile updated successfully", updated));
    }
}

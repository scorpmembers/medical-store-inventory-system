package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import com.medstore.dto.CreateStaffRequest;
import com.medstore.dto.UserDto;
import com.medstore.security.CustomUserDetails;
import com.medstore.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    /**
     * List all staff members in the Admin's store (tenant-scoped)
     */
    @GetMapping("/staff")
    public ResponseEntity<ApiResponse<List<UserDto>>> getStaff(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        List<UserDto> staff = adminUserService.getStaffByStore(storeId);
        return ResponseEntity.ok(ApiResponse.success("Staff members retrieved successfully", staff));
    }

    /**
     * Admin creates a new staff account scoped to their store
     */
    @PostMapping("/staff")
    public ResponseEntity<ApiResponse<UserDto>> createStaff(
            @Valid @RequestBody CreateStaffRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        UserDto staff = adminUserService.createStaffByAdmin(storeId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Staff account created successfully", staff));
    }

    /**
     * Toggle active/inactive status of a staff member (tenant-scoped)
     */
    @PutMapping("/staff/{id}/toggle-status")
    public ResponseEntity<ApiResponse<UserDto>> toggleStaffStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        UserDto updated = adminUserService.toggleStaffStatus(id, storeId, userDetails.getUsername());
        String statusStr = updated.isActive() ? "activated" : "deactivated";
        return ResponseEntity.ok(ApiResponse.success("Staff member successfully " + statusStr, updated));
    }

    /**
     * Delete a staff account (tenant-scoped, Admin cannot delete self or other Admin)
     */
    @DeleteMapping("/staff/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long storeId = userDetails.getStoreId();
        adminUserService.deleteStaff(id, storeId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Staff member deleted successfully"));
    }
}

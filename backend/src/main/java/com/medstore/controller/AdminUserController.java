package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import com.medstore.dto.CreateStaffRequest;
import com.medstore.dto.UserDto;
import com.medstore.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    /**
     * List all system users (Admin + Staff)
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = adminUserService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    /**
     * List all staff members
     */
    @GetMapping("/staff")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllStaff() {
        List<UserDto> staff = adminUserService.getAllStaff();
        return ResponseEntity.ok(ApiResponse.success("Staff members retrieved successfully", staff));
    }

    /**
     * Admin creates a new staff account directly
     */
    @PostMapping("/staff")
    public ResponseEntity<ApiResponse<UserDto>> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        UserDto staff = adminUserService.createStaffByAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Staff account created successfully by Administrator", staff));
    }

    /**
     * Toggle active/inactive status of a staff member
     */
    @PutMapping("/staff/{id}/toggle-status")
    public ResponseEntity<ApiResponse<UserDto>> toggleStaffStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        UserDto updated = adminUserService.toggleStaffStatus(id, userDetails.getUsername());
        String statusStr = updated.isActive() ? "activated" : "deactivated";
        return ResponseEntity.ok(ApiResponse.success("Staff member successfully " + statusStr, updated));
    }

    /**
     * Delete a staff account
     */
    @DeleteMapping("/staff/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        adminUserService.deleteStaff(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Staff member deleted successfully"));
    }
}

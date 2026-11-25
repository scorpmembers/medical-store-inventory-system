package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF')")
public class StaffDashboardController {

    /**
     * Endpoint accessible by both Staff and Admin to verify permissions
     */
    @GetMapping("/permissions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStaffPermissions(@AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Map<String, Object> perms = new HashMap<>();
        perms.put("username", userDetails.getUsername());
        perms.put("role", isAdmin ? "ROLE_ADMIN" : "ROLE_STAFF");
        perms.put("canSell", true);
        perms.put("canViewMedicines", true);
        perms.put("canViewInventory", true);
        perms.put("canManageStaff", isAdmin);
        perms.put("canManageSuppliers", isAdmin);
        perms.put("canViewReports", isAdmin);
        perms.put("canDeleteRecords", isAdmin);

        return ResponseEntity.ok(ApiResponse.success("Permissions resolved", perms));
    }
}

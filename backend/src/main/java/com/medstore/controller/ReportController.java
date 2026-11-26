package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import com.medstore.security.CustomUserDetails;
import com.medstore.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * Dashboard summary stats (Admin & Staff can access)
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Map<String, Object> stats = reportService.getDashboardStats(userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }
}

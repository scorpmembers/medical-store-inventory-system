package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import com.medstore.dto.BatchResponse;
import com.medstore.model.Batch;
import com.medstore.security.CustomUserDetails;
import com.medstore.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BatchResponse>>> getAllBatches(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<BatchResponse> batches = inventoryService.getAllBatches(userDetails.getStoreId()).stream()
                .map(BatchResponse::from)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Inventory batches retrieved", batches));
    }

    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<ApiResponse<List<BatchResponse>>> getBatchesByMedicine(
            @PathVariable Long medicineId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<BatchResponse> batches = inventoryService.getBatchesByMedicine(userDetails.getStoreId(), medicineId).stream()
                .map(BatchResponse::from)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Batches retrieved for medicine", batches));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BatchResponse>> getBatchById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Batch batch = inventoryService.getBatchById(id, userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Batch retrieved", BatchResponse.from(batch)));
    }

    @PostMapping("/medicine/{medicineId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<BatchResponse>> addBatch(
            @PathVariable Long medicineId,
            @RequestBody Batch batch,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Batch created = inventoryService.addBatch(userDetails.getStoreId(), medicineId, batch);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Batch added to inventory", BatchResponse.from(created)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<BatchResponse>> updateBatch(
            @PathVariable Long id,
            @RequestBody Batch batch,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Batch updated = inventoryService.updateBatch(id, userDetails.getStoreId(), batch);
        return ResponseEntity.ok(ApiResponse.success("Batch updated successfully", BatchResponse.from(updated)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBatch(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        inventoryService.deleteBatch(id, userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Batch removed from inventory"));
    }
}

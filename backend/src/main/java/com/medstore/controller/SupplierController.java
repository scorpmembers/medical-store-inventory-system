package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import com.medstore.model.Supplier;
import com.medstore.security.CustomUserDetails;
import com.medstore.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Supplier>>> getAllSuppliers(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Supplier> suppliers = supplierService.getAllSuppliers(userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Suppliers retrieved", suppliers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Supplier>> getSupplierById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Supplier supplier = supplierService.getSupplierById(id, userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Supplier retrieved", supplier));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Supplier>> createSupplier(
            @RequestBody Supplier supplier,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Supplier created = supplierService.createSupplier(userDetails.getStoreId(), supplier);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Supplier added successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Supplier>> updateSupplier(
            @PathVariable Long id,
            @RequestBody Supplier supplier,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Supplier updated = supplierService.updateSupplier(id, userDetails.getStoreId(), supplier);
        return ResponseEntity.ok(ApiResponse.success("Supplier updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSupplier(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        supplierService.deleteSupplier(id, userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Supplier deleted successfully"));
    }
}

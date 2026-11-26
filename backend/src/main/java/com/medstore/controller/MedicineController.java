package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import com.medstore.model.Medicine;
import com.medstore.security.CustomUserDetails;
import com.medstore.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Medicine>>> getAllMedicines(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Medicine> medicines = medicineService.getAllMedicines(userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Medicines retrieved", medicines));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Medicine>> getMedicineById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Medicine medicine = medicineService.getMedicineById(id, userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Medicine retrieved", medicine));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Medicine>> createMedicine(
            @RequestBody Medicine medicine,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Medicine created = medicineService.createMedicine(userDetails.getStoreId(), medicine);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Medicine added successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Medicine>> updateMedicine(
            @PathVariable Long id,
            @RequestBody Medicine medicine,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Medicine updated = medicineService.updateMedicine(id, userDetails.getStoreId(), medicine);
        return ResponseEntity.ok(ApiResponse.success("Medicine updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMedicine(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        medicineService.deleteMedicine(id, userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Medicine deleted successfully"));
    }
}

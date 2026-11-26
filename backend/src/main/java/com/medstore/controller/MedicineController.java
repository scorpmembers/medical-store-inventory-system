package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import com.medstore.dto.MedicineResponse;
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
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getAllMedicines(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<MedicineResponse> medicines = medicineService.getAllMedicines(userDetails.getStoreId()).stream()
                .map(MedicineResponse::from)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Medicines retrieved", medicines));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicineResponse>> getMedicineById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Medicine medicine = medicineService.getMedicineById(id, userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Medicine retrieved", MedicineResponse.from(medicine)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<MedicineResponse>> createMedicine(
            @RequestBody Medicine medicine,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Medicine created = medicineService.createMedicine(userDetails.getStoreId(), medicine);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Medicine added successfully", MedicineResponse.from(created)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<MedicineResponse>> updateMedicine(
            @PathVariable Long id,
            @RequestBody Medicine medicine,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Medicine updated = medicineService.updateMedicine(id, userDetails.getStoreId(), medicine);
        return ResponseEntity.ok(ApiResponse.success("Medicine updated successfully", MedicineResponse.from(updated)));
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

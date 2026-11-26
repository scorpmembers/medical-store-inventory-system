package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import com.medstore.dto.PurchaseResponse;
import com.medstore.model.Purchase;
import com.medstore.security.CustomUserDetails;
import com.medstore.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class PurchaseController {

    @Autowired
    private PurchaseService purchaseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PurchaseResponse>>> getAllPurchases(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<PurchaseResponse> purchases = purchaseService.getAllPurchases(userDetails.getStoreId()).stream()
                .map(PurchaseResponse::from)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Purchases retrieved", purchases));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseResponse>> getPurchaseById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Purchase purchase = purchaseService.getPurchaseById(id, userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Purchase retrieved", PurchaseResponse.from(purchase)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PurchaseResponse>> createPurchase(
            @RequestBody Purchase purchase,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Purchase created = purchaseService.createPurchase(userDetails.getStoreId(), purchase);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Purchase recorded and inventory updated", PurchaseResponse.from(created)));
    }
}

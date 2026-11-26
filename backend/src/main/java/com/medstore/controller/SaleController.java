package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import com.medstore.model.Sale;
import com.medstore.security.CustomUserDetails;
import com.medstore.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF')")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Sale>>> getAllSales(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Sale> sales = saleService.getAllSales(userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Sales retrieved", sales));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Sale>> getSaleById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Sale sale = saleService.getSaleById(id, userDetails.getStoreId());
        return ResponseEntity.ok(ApiResponse.success("Sale retrieved", sale));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Sale>> createSale(
            @RequestBody Sale sale,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Sale created = saleService.createSale(userDetails.getStoreId(), sale);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Sale completed successfully", created));
    }
}

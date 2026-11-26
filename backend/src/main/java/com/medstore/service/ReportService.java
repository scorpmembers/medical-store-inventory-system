package com.medstore.service;

import com.medstore.model.Batch;
import com.medstore.model.Purchase;
import com.medstore.model.Sale;
import com.medstore.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class ReportService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats(Long storeId) {
        if (storeId == null) throw new IllegalArgumentException("Store ID is required.");

        LocalDate today = LocalDate.now();
        LocalDate expiryThreshold = today.plusDays(60);

        long totalMedicines = medicineRepository.countByStoreIdAndActiveTrue(storeId);
        long totalSuppliers = supplierRepository.countByStoreId(storeId);
        long totalPurchases = purchaseRepository.countByStoreId(storeId);
        long totalSalesCount = saleRepository.countByStoreId(storeId);

        List<Batch> batches = batchRepository.findByStoreIdOrderByExpiryDateAsc(storeId);
        int totalStockUnits = batches.stream().mapToInt(Batch::getQuantity).sum();

        long lowStockCount = batches.stream()
                .filter(b -> b.getQuantity() <= 15)
                .count();

        long nearExpiryCount = batches.stream()
                .filter(b -> !b.getExpiryDate().isBefore(today) && b.getExpiryDate().isBefore(expiryThreshold))
                .count();

        long expiredCount = batches.stream()
                .filter(b -> b.getExpiryDate().isBefore(today))
                .count();

        // Today's sales
        List<Sale> todaySales = saleRepository.findByStoreIdAndSaleDate(storeId, today);
        BigDecimal todayRevenue = todaySales.stream()
                .map(Sale::getGrandTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Overall revenue
        List<Sale> allSales = saleRepository.findByStoreIdOrderBySaleDateDesc(storeId);
        BigDecimal totalRevenue = allSales.stream()
                .map(Sale::getGrandTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Recent sales (limit to 5)
        List<Sale> recentSales = allSales.stream().limit(5).toList();

        // Recent purchases (limit to 5)
        List<Purchase> recentPurchases = purchaseRepository.findByStoreIdOrderByPurchaseDateDesc(storeId).stream().limit(5).toList();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMedicines", totalMedicines);
        stats.put("totalStockUnits", totalStockUnits);
        stats.put("lowStockCount", lowStockCount);
        stats.put("nearExpiryCount", nearExpiryCount);
        stats.put("expiredCount", expiredCount);
        stats.put("totalSuppliers", totalSuppliers);
        stats.put("totalPurchases", totalPurchases);
        stats.put("totalSalesCount", totalSalesCount);
        stats.put("todaySalesCount", todaySales.size());
        stats.put("todayRevenue", todayRevenue);
        stats.put("totalRevenue", totalRevenue);
        stats.put("recentSales", recentSales);
        stats.put("recentPurchases", recentPurchases);

        return stats;
    }
}

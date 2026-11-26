package com.medstore.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        long totalMedicines,
        int totalStockUnits,
        long lowStockCount,
        long nearExpiryCount,
        long expiredCount,
        long totalSuppliers,
        long totalPurchases,
        long totalSalesCount,
        long todaySalesCount,
        BigDecimal todayRevenue,
        BigDecimal totalRevenue,
        List<SaleResponse> recentSales,
        List<PurchaseResponse> recentPurchases
) {
}

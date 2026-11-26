package com.medstore;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstore.dto.BatchResponse;
import com.medstore.dto.MedicineResponse;
import com.medstore.dto.PurchaseResponse;
import com.medstore.dto.SaleResponse;
import com.medstore.dto.SupplierResponse;
import com.medstore.model.Batch;
import com.medstore.model.Medicine;
import com.medstore.model.Purchase;
import com.medstore.model.PurchaseItem;
import com.medstore.model.Sale;
import com.medstore.model.SaleItem;
import com.medstore.model.Store;
import com.medstore.model.Supplier;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class BusinessResponseSerializationTest {

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Test
    void batchAndSupplierResponsesDoNotSerializeStoreAssociations() throws Exception {
        Medicine medicine = new Medicine() {
            @Override
            public Store getStore() {
                throw new AssertionError("Medicine store must not be accessed");
            }
        };
        medicine.setId(7L);
        medicine.setName("Example medicine");

        Batch batch = new Batch() {
            @Override
            public Store getStore() {
                throw new AssertionError("Batch store must not be accessed");
            }
        };
        batch.setId(3L);
        batch.setMedicine(medicine);
        batch.setBatchNumber("B-123");

        Supplier supplier = new Supplier(null, "Example supplier", null, "5551234567", null, null, null) {
            @Override
            public Store getStore() {
                throw new AssertionError("Supplier store must not be accessed");
            }
        };
        supplier.setId(4L);

        String medicineJson = objectMapper.writeValueAsString(MedicineResponse.from(medicine));
        String batchJson = objectMapper.writeValueAsString(BatchResponse.from(batch));
        String supplierJson = objectMapper.writeValueAsString(SupplierResponse.from(supplier));

        assertTrue(medicineJson.contains("\"name\":\"Example medicine\""));
        assertFalse(medicineJson.contains("hibernateLazyInitializer"));
        assertFalse(medicineJson.contains("\"store\""));
        assertTrue(batchJson.contains("\"medicine\":{\"id\":7,\"name\":\"Example medicine\"}"));
        assertFalse(batchJson.contains("hibernateLazyInitializer"));
        assertFalse(batchJson.contains("\"store\""));
        assertFalse(supplierJson.contains("hibernateLazyInitializer"));
        assertFalse(supplierJson.contains("\"store\""));
    }

    @Test
    void transactionResponsesDoNotSerializeLazyParentsOrStoreAssociations() throws Exception {
        PurchaseItem purchaseItem = new PurchaseItem(null, "Example medicine", "P-123", 1, null, null, null, null) {
            @Override
            public Purchase getPurchase() {
                throw new AssertionError("Purchase parent must not be accessed");
            }
        };

        Purchase purchase = new Purchase() {
            @Override
            public Store getStore() {
                throw new AssertionError("Purchase store must not be accessed");
            }
        };
        purchase.setItems(List.of(purchaseItem));

        SaleItem saleItem = new SaleItem(null, "Example medicine", "S-123", 1, null, null) {
            @Override
            public Sale getSale() {
                throw new AssertionError("Sale parent must not be accessed");
            }
        };

        Sale sale = new Sale() {
            @Override
            public Store getStore() {
                throw new AssertionError("Sale store must not be accessed");
            }
        };
        sale.setItems(List.of(saleItem));

        String purchaseJson = objectMapper.writeValueAsString(PurchaseResponse.from(purchase));
        String saleJson = objectMapper.writeValueAsString(SaleResponse.from(sale));

        assertTrue(purchaseJson.contains("\"medicineName\":\"Example medicine\""));
        assertFalse(purchaseJson.contains("hibernateLazyInitializer"));
        assertFalse(purchaseJson.contains("\"purchase\""));
        assertFalse(purchaseJson.contains("\"store\""));
        assertTrue(saleJson.contains("\"medicineName\":\"Example medicine\""));
        assertFalse(saleJson.contains("hibernateLazyInitializer"));
        assertFalse(saleJson.contains("\"sale\""));
        assertFalse(saleJson.contains("\"store\""));
    }
}

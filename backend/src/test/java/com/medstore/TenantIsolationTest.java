package com.medstore;

import com.medstore.model.Role;
import com.medstore.repository.BatchRepository;
import com.medstore.repository.MedicineRepository;
import com.medstore.repository.PurchaseRepository;
import com.medstore.repository.SaleRepository;
import com.medstore.repository.SupplierRepository;
import com.medstore.repository.UserRepository;
import com.medstore.service.AdminUserService;
import com.medstore.service.InventoryService;
import com.medstore.service.MedicineService;
import com.medstore.service.PurchaseService;
import com.medstore.service.SaleService;
import com.medstore.service.SupplierService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class TenantIsolationTest {

    private static final long TENANT_ID = 10L;
    private static final long FOREIGN_RECORD_ID = 99L;

    private MedicineRepository medicineRepository;
    private SupplierRepository supplierRepository;
    private BatchRepository batchRepository;
    private PurchaseRepository purchaseRepository;
    private SaleRepository saleRepository;
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        medicineRepository = mock(MedicineRepository.class);
        supplierRepository = mock(SupplierRepository.class);
        batchRepository = mock(BatchRepository.class);
        purchaseRepository = mock(PurchaseRepository.class);
        saleRepository = mock(SaleRepository.class);
        userRepository = mock(UserRepository.class);
    }

    @Test
    void medicineLookupRejectsRecordOutsideAuthenticatedStore() {
        when(medicineRepository.findByIdAndStoreId(FOREIGN_RECORD_ID, TENANT_ID)).thenReturn(Optional.empty());
        MedicineService service = new MedicineService();
        ReflectionTestUtils.setField(service, "medicineRepository", medicineRepository);

        assertThrows(IllegalArgumentException.class, () -> service.getMedicineById(FOREIGN_RECORD_ID, TENANT_ID));
        verify(medicineRepository).findByIdAndStoreId(FOREIGN_RECORD_ID, TENANT_ID);
    }

    @Test
    void supplierLookupRejectsRecordOutsideAuthenticatedStore() {
        when(supplierRepository.findByIdAndStoreId(FOREIGN_RECORD_ID, TENANT_ID)).thenReturn(Optional.empty());
        SupplierService service = new SupplierService();
        ReflectionTestUtils.setField(service, "supplierRepository", supplierRepository);

        assertThrows(IllegalArgumentException.class, () -> service.getSupplierById(FOREIGN_RECORD_ID, TENANT_ID));
        verify(supplierRepository).findByIdAndStoreId(FOREIGN_RECORD_ID, TENANT_ID);
    }

    @Test
    void inventoryLookupRejectsRecordOutsideAuthenticatedStore() {
        when(batchRepository.findByIdAndStoreId(FOREIGN_RECORD_ID, TENANT_ID)).thenReturn(Optional.empty());
        InventoryService service = new InventoryService();
        ReflectionTestUtils.setField(service, "batchRepository", batchRepository);

        assertThrows(IllegalArgumentException.class, () -> service.getBatchById(FOREIGN_RECORD_ID, TENANT_ID));
        verify(batchRepository).findByIdAndStoreId(FOREIGN_RECORD_ID, TENANT_ID);
    }

    @Test
    void purchaseLookupRejectsRecordOutsideAuthenticatedStore() {
        when(purchaseRepository.findByIdAndStoreId(FOREIGN_RECORD_ID, TENANT_ID)).thenReturn(Optional.empty());
        PurchaseService service = new PurchaseService();
        ReflectionTestUtils.setField(service, "purchaseRepository", purchaseRepository);

        assertThrows(IllegalArgumentException.class, () -> service.getPurchaseById(FOREIGN_RECORD_ID, TENANT_ID));
        verify(purchaseRepository).findByIdAndStoreId(FOREIGN_RECORD_ID, TENANT_ID);
    }

    @Test
    void saleLookupRejectsRecordOutsideAuthenticatedStore() {
        when(saleRepository.findByIdAndStoreId(FOREIGN_RECORD_ID, TENANT_ID)).thenReturn(Optional.empty());
        SaleService service = new SaleService();
        ReflectionTestUtils.setField(service, "saleRepository", saleRepository);

        assertThrows(IllegalArgumentException.class, () -> service.getSaleById(FOREIGN_RECORD_ID, TENANT_ID));
        verify(saleRepository).findByIdAndStoreId(FOREIGN_RECORD_ID, TENANT_ID);
    }

    @Test
    void staffListIsFilteredByAuthenticatedStore() {
        when(userRepository.findByStoreIdAndRole(TENANT_ID, Role.ROLE_STAFF))
                .thenReturn(Collections.emptyList());
        AdminUserService service = new AdminUserService();
        ReflectionTestUtils.setField(service, "userRepository", userRepository);

        service.getStaffByStore(TENANT_ID);

        verify(userRepository).findByStoreIdAndRole(TENANT_ID, Role.ROLE_STAFF);
    }

    @Test
    void staffMutationRejectsRecordOutsideAuthenticatedStore() {
        when(userRepository.findByIdAndStoreId(FOREIGN_RECORD_ID, TENANT_ID)).thenReturn(Optional.empty());
        AdminUserService service = new AdminUserService();
        ReflectionTestUtils.setField(service, "userRepository", userRepository);

        assertThrows(IllegalArgumentException.class, () ->
                service.toggleStaffStatus(FOREIGN_RECORD_ID, TENANT_ID, "admin@example.com"));
        verify(userRepository).findByIdAndStoreId(FOREIGN_RECORD_ID, TENANT_ID);
    }
}

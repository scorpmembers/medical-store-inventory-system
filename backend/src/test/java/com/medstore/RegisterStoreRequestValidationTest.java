package com.medstore;

import com.medstore.dto.RegisterStoreRequest;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class RegisterStoreRequestValidationTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidator() {
        validatorFactory.close();
    }

    @Test
    void acceptsValidStoreRegistration() {
        assertTrue(validator.validate(validRequest()).isEmpty());
    }

    @Test
    void rejectsMalformedOptionalGstin() {
        RegisterStoreRequest request = validRequest();
        request.setGstin("not-a-gstin");

        assertTrue(validator.validate(request).stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("gstin")));
    }

    private static RegisterStoreRequest validRequest() {
        RegisterStoreRequest request = new RegisterStoreRequest();
        request.setOwnerName("Owner Name");
        request.setEmail("owner@example.com");
        request.setPhone("9876543210");
        request.setPassword("secret1");
        request.setConfirmPassword("secret1");
        request.setStoreName("Example Pharmacy");
        request.setStorePhone("9876543210");
        request.setAddress("1 Main Street");
        request.setCity("Mumbai");
        request.setState("Maharashtra");
        request.setPincode("400001");
        request.setDrugLicenseNumber("DL-12345");
        return request;
    }
}

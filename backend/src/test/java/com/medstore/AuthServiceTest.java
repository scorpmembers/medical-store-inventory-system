package com.medstore;

import com.medstore.dto.AuthResponse;
import com.medstore.dto.RegisterStoreRequest;
import com.medstore.model.Role;
import com.medstore.model.Store;
import com.medstore.model.User;
import com.medstore.repository.StoreRepository;
import com.medstore.repository.UserRepository;
import com.medstore.security.JwtUtil;
import com.medstore.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.lang.reflect.Proxy;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for multi-tenant store registration in AuthService.
 */
public class AuthServiceTest {

    private AuthService authService;
    private BCryptPasswordEncoder passwordEncoder;
    private boolean emailExists = false;
    private final User[] lastSavedUser = new User[1];
    private final Store[] lastSavedStore = new Store[1];

    @BeforeEach
    void setUp() {
        authService = new AuthService();
        passwordEncoder = new BCryptPasswordEncoder();
        emailExists = false;
        lastSavedUser[0] = null;
        lastSavedStore[0] = null;

        UserRepository proxyRepo = (UserRepository) Proxy.newProxyInstance(
                UserRepository.class.getClassLoader(),
                new Class<?>[]{UserRepository.class},
                (proxy, method, args) -> {
                    if ("existsByEmail".equals(method.getName())) {
                        return emailExists;
                    }
                    if ("save".equals(method.getName())) {
                        User u = (User) args[0];
                        u.setId(101L);
                        lastSavedUser[0] = u;
                        return u;
                    }
                    return null;
                }
        );

        StoreRepository proxyStoreRepo = (StoreRepository) Proxy.newProxyInstance(
                StoreRepository.class.getClassLoader(),
                new Class<?>[]{StoreRepository.class},
                (proxy, method, args) -> {
                    if ("save".equals(method.getName())) {
                        Store s = (Store) args[0];
                        s.setId(1L);
                        lastSavedStore[0] = s;
                        return s;
                    }
                    return null;
                }
        );

        JwtUtil stubJwt = new JwtUtil() {
            @Override
            public String generateToken(String email, Role role, String name, Long id, Long storeId, String storeName) {
                return "mock_token_" + email;
            }
        };

        ReflectionTestUtils.setField(authService, "userRepository", proxyRepo);
        ReflectionTestUtils.setField(authService, "storeRepository", proxyStoreRepo);
        ReflectionTestUtils.setField(authService, "passwordEncoder", passwordEncoder);
        ReflectionTestUtils.setField(authService, "jwtUtil", stubJwt);
    }

    @Test
    void testRegisterStoreSuccess() {
        RegisterStoreRequest request = new RegisterStoreRequest();
        request.setOwnerName("Ramesh Kumar");
        request.setEmail("ramesh@medstore.com");
        request.setPhone("9876543210");
        request.setPassword("Password@123");
        request.setConfirmPassword("Password@123");
        request.setStoreName("Ramesh Pharmacy");
        request.setAddress("123, Main Street");
        request.setCity("Mumbai");
        request.setState("Maharashtra");
        request.setPincode("400001");

        AuthResponse response = authService.registerStore(request);

        assertNotNull(response);
        assertEquals("ramesh@medstore.com", response.getEmail());
        assertEquals(Role.ROLE_ADMIN, response.getRole(), "Store registration must assign ROLE_ADMIN to owner");
        assertTrue(response.getToken().startsWith("mock_token_"));

        // Verify store was created
        assertNotNull(lastSavedStore[0]);
        assertEquals("Ramesh Pharmacy", lastSavedStore[0].getStoreName());
        assertEquals(1L, response.getStoreId());

        // Verify password was encrypted with BCrypt hash
        assertNotNull(lastSavedUser[0]);
        assertNotEquals("Password@123", lastSavedUser[0].getPassword());
        assertTrue(passwordEncoder.matches("Password@123", lastSavedUser[0].getPassword()));
    }

    @Test
    void testRegisterStorePasswordMismatch() {
        RegisterStoreRequest request = new RegisterStoreRequest();
        request.setOwnerName("Ramesh Kumar");
        request.setEmail("ramesh@medstore.com");
        request.setPhone("9876543210");
        request.setPassword("Password@123");
        request.setConfirmPassword("DifferentPassword");
        request.setStoreName("Ramesh Pharmacy");
        request.setAddress("123, Main Street");
        request.setCity("Mumbai");
        request.setState("Maharashtra");
        request.setPincode("400001");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                authService.registerStore(request)
        );

        assertTrue(exception.getMessage().contains("do not match"));
        assertNull(lastSavedUser[0]);
    }

    @Test
    void testRegisterStoreDuplicateEmailThrowsException() {
        emailExists = true;

        RegisterStoreRequest request = new RegisterStoreRequest();
        request.setOwnerName("Ramesh Kumar");
        request.setEmail("existing@medstore.com");
        request.setPhone("9876543210");
        request.setPassword("Password@123");
        request.setConfirmPassword("Password@123");
        request.setStoreName("Duplicate Pharmacy");
        request.setAddress("123, Main Street");
        request.setCity("Mumbai");
        request.setState("Maharashtra");
        request.setPincode("400001");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                authService.registerStore(request)
        );

        assertTrue(exception.getMessage().contains("already exists"));
        assertNull(lastSavedUser[0]);
    }
}

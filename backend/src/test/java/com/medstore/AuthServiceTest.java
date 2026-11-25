package com.medstore;

import com.medstore.dto.AuthResponse;
import com.medstore.dto.SignupRequest;
import com.medstore.model.Role;
import com.medstore.model.User;
import com.medstore.repository.UserRepository;
import com.medstore.security.JwtUtil;
import com.medstore.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.lang.reflect.Proxy;

import static org.junit.jupiter.api.Assertions.*;

public class AuthServiceTest {

    private AuthService authService;
    private BCryptPasswordEncoder passwordEncoder;
    private boolean emailExists = false;
    private final User[] lastSavedUser = new User[1];

    @BeforeEach
    void setUp() {
        authService = new AuthService();
        passwordEncoder = new BCryptPasswordEncoder();
        emailExists = false;
        lastSavedUser[0] = null;

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

        JwtUtil stubJwt = new JwtUtil() {
            @Override
            public String generateToken(String email, Role role, String name, Long id) {
                return "mock_token_" + email;
            }
        };

        ReflectionTestUtils.setField(authService, "userRepository", proxyRepo);
        ReflectionTestUtils.setField(authService, "passwordEncoder", passwordEncoder);
        ReflectionTestUtils.setField(authService, "jwtUtil", stubJwt);
    }

    @Test
    void testStaffSignupSuccess() {
        SignupRequest request = new SignupRequest(
                "Ramesh Kumar",
                "ramesh@medstore.com",
                "Password@123",
                "Password@123",
                "+91 98112 34567"
        );

        AuthResponse response = authService.registerStaff(request);

        assertNotNull(response);
        assertEquals("ramesh@medstore.com", response.getEmail());
        assertEquals(Role.ROLE_STAFF, response.getRole(), "Public signup must strictly assign ROLE_STAFF");
        assertTrue(response.getToken().startsWith("mock_token_"));

        // Verify password was encrypted with BCrypt hash
        assertNotNull(lastSavedUser[0]);
        assertNotEquals("Password@123", lastSavedUser[0].getPassword());
        assertTrue(passwordEncoder.matches("Password@123", lastSavedUser[0].getPassword()));
    }

    @Test
    void testSignupPasswordMismatchThrowsException() {
        SignupRequest request = new SignupRequest(
                "Ramesh Kumar",
                "ramesh@medstore.com",
                "Password@123",
                "DifferentPassword@123",
                "+91 98112 34567"
        );

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.registerStaff(request);
        });

        assertTrue(exception.getMessage().contains("do not match"));
        assertNull(lastSavedUser[0]);
    }

    @Test
    void testSignupDuplicateEmailThrowsException() {
        emailExists = true;

        SignupRequest request = new SignupRequest(
                "Ramesh Kumar",
                "ramesh@medstore.com",
                "Password@123",
                "Password@123",
                "+91 98112 34567"
        );

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.registerStaff(request);
        });

        assertTrue(exception.getMessage().contains("already registered"));
        assertNull(lastSavedUser[0]);
    }
}

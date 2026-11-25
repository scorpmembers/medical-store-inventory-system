package com.medstore.config;

import com.medstore.model.Role;
import com.medstore.model.User;
import com.medstore.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.default-admin.name:System Administrator}")
    private String adminName;

    @Value("${app.default-admin.email:admin@medstore.com}")
    private String adminEmail;

    @Value("${app.default-admin.password:Admin@123}")
    private String adminPassword;

    @Value("${app.default-admin.phone:+91 98110 00001}")
    private String adminPhone;

    @Override
    public void run(String... args) throws Exception {
        // Check if an Admin account already exists in database
        if (userRepository.countByRole(Role.ROLE_ADMIN) == 0) {
            logger.info("==================================================================");
            logger.info("No Admin account detected. Seeding initial Administrator user...");

            User admin = new User();
            admin.setName(adminName);
            admin.setEmail(adminEmail.toLowerCase().trim());
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setPhone(adminPhone);
            admin.setRole(Role.ROLE_ADMIN);
            admin.setActive(true);

            userRepository.save(admin);

            logger.info("Default Admin account created successfully!");
            logger.info("Email:    {}", adminEmail);
            logger.info("Password: {}", adminPassword);
            logger.info("Role:     ROLE_ADMIN");
            logger.info("==================================================================");
        } else {
            logger.info("Admin account already exists in database. Skipping admin seeding.");
        }

        // Also check if a default sample Staff account exists for quick testing
        if (userRepository.countByRole(Role.ROLE_STAFF) == 0) {
            logger.info("Seeding initial demo Staff account for immediate testing...");

            User staff = new User();
            staff.setName("Pharmacist Staff");
            staff.setEmail("staff@medstore.com");
            staff.setPassword(passwordEncoder.encode("Staff@123"));
            staff.setPhone("+91 98110 00002");
            staff.setRole(Role.ROLE_STAFF);
            staff.setActive(true);

            userRepository.save(staff);

            logger.info("Default Staff account created successfully!");
            logger.info("Email:    staff@medstore.com");
            logger.info("Password: Staff@123");
            logger.info("Role:     ROLE_STAFF");
            logger.info("==================================================================");
        }
    }
}

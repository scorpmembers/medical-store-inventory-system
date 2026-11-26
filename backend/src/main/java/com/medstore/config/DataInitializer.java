package com.medstore.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Override
    public void run(String... args) {
        // Tenants and their first administrator are created only by store registration.
    }
}

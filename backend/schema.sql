-- ========================================================
-- Medical Store Inventory and Sales Management System
-- Database Setup Script for MySQL
-- Database Name: medical_store_db
-- ========================================================

CREATE DATABASE IF NOT EXISTS `medical_store_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `medical_store_db`;

-- --------------------------------------------------------
-- Table: users (Managed by Spring Data JPA / Hibernate)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `role` VARCHAR(20) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Sample Pre-seeded Accounts
-- Passwords are encrypted with BCrypt (10 rounds):
-- 1. admin@medstore.com  -> Password: Admin@123
-- 2. staff@medstore.com  -> Password: Staff@123
-- Note: Spring Boot's DataInitializer will also auto-seed these
-- if the table is empty!
-- --------------------------------------------------------
INSERT INTO `users` (`name`, `email`, `password`, `phone`, `role`, `active`, `created_at`, `updated_at`)
VALUES
    ('System Administrator', 'admin@medstore.com', '$2a$10$wN9iL6b6zC8J3VvC4XgR6eeR8Rj3xK9K1wL1qE1vQ5wT3sO1zK9K1', '+91 98110 00001', 'ROLE_ADMIN', 1, NOW(), NOW()),
    ('Pharmacist Staff', 'staff@medstore.com', '$2a$10$7Z2vA8o9L5j1xM2qK4wE7ueT5Tk1rL3zO2wN0pS4xV6uR0yM2qK4w', '+91 98110 00002', 'ROLE_STAFF', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `email`=`email`;

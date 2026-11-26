-- Fresh-install schema for Medical Store Inventory and Sales Management.
-- Existing databases must use schema/migration/V2__multitenant.sql before startup.
-- This script is additive and contains no sample accounts or destructive statements.

CREATE DATABASE IF NOT EXISTS `medical_store_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `medical_store_db`;

CREATE TABLE IF NOT EXISTS `stores` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `store_name` VARCHAR(150) NOT NULL,
    `owner_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(120) DEFAULT NULL,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(80) NOT NULL,
    `state` VARCHAR(80) NOT NULL,
    `pincode` VARCHAR(12) NOT NULL,
    `gstin` VARCHAR(20) DEFAULT NULL,
    `drug_license_number` VARCHAR(50) DEFAULT NULL,
    `logo_url` VARCHAR(255) DEFAULT NULL,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_stores_email` (`email`),
    INDEX `idx_stores_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `store_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(120) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `role` VARCHAR(20) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_store_id` (`store_id`),
    INDEX `idx_users_role` (`role`),
    CONSTRAINT `fk_users_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `medicines` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `store_id` BIGINT NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `generic_name` VARCHAR(150) DEFAULT NULL,
    `category` VARCHAR(80) NOT NULL,
    `dosage` VARCHAR(50) DEFAULT NULL,
    `rack_location` VARCHAR(50) DEFAULT NULL,
    `unit` VARCHAR(50) DEFAULT NULL,
    `min_stock_alert` INT NOT NULL DEFAULT 15,
    `manufacturer` VARCHAR(100) DEFAULT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_medicines_store` (`store_id`),
    INDEX `idx_medicines_name` (`name`),
    INDEX `idx_medicines_category` (`category`),
    CONSTRAINT `fk_medicines_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `suppliers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `store_id` BIGINT NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `contact_person` VARCHAR(100) DEFAULT NULL,
    `phone` VARCHAR(25) NOT NULL,
    `email` VARCHAR(120) DEFAULT NULL,
    `address` VARCHAR(255) DEFAULT NULL,
    `gstin` VARCHAR(25) DEFAULT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'Active',
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_suppliers_store` (`store_id`),
    INDEX `idx_suppliers_name` (`name`),
    CONSTRAINT `fk_suppliers_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `medicine_batches` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `store_id` BIGINT NOT NULL,
    `medicine_id` BIGINT NOT NULL,
    `batch_number` VARCHAR(50) NOT NULL,
    `quantity` INT NOT NULL,
    `purchase_price` DECIMAL(10,2) NOT NULL,
    `selling_price` DECIMAL(10,2) NOT NULL,
    `mfg_date` DATE NOT NULL,
    `expiry_date` DATE NOT NULL,
    `supplier_name` VARCHAR(120) DEFAULT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_batches_store_number` (`store_id`, `batch_number`),
    INDEX `idx_batches_store` (`store_id`),
    INDEX `idx_batches_medicine` (`medicine_id`),
    INDEX `idx_batches_number` (`batch_number`),
    INDEX `idx_batches_expiry` (`expiry_date`),
    CONSTRAINT `fk_batches_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
    CONSTRAINT `fk_batches_medicine` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `purchases` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `store_id` BIGINT NOT NULL,
    `purchase_code` VARCHAR(50) NOT NULL,
    `invoice_number` VARCHAR(80) DEFAULT NULL,
    `supplier_name` VARCHAR(120) NOT NULL,
    `total_amount` DECIMAL(12,2) NOT NULL,
    `purchase_date` DATE NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'Received',
    `created_at` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_purchases_store` (`store_id`),
    INDEX `idx_purchases_invoice` (`invoice_number`),
    INDEX `idx_purchases_date` (`purchase_date`),
    CONSTRAINT `fk_purchases_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `purchase_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `purchase_id` BIGINT NOT NULL,
    `medicine_name` VARCHAR(150) NOT NULL,
    `batch_number` VARCHAR(50) NOT NULL,
    `quantity` INT NOT NULL,
    `purchase_price` DECIMAL(10,2) NOT NULL,
    `selling_price` DECIMAL(10,2) DEFAULT NULL,
    `expiry_date` DATE DEFAULT NULL,
    `total_cost` DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_purchase_items_purchase` (`purchase_id`),
    CONSTRAINT `fk_purchase_items_purchase` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `sales` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `store_id` BIGINT NOT NULL,
    `invoice_number` VARCHAR(50) NOT NULL,
    `customer_name` VARCHAR(100) DEFAULT NULL,
    `customer_phone` VARCHAR(20) DEFAULT NULL,
    `doctor_name` VARCHAR(100) DEFAULT NULL,
    `payment_method` VARCHAR(30) NOT NULL,
    `subtotal` DECIMAL(12,2) NOT NULL,
    `discount` DECIMAL(10,2) DEFAULT 0,
    `tax` DECIMAL(10,2) DEFAULT 0,
    `grand_total` DECIMAL(12,2) NOT NULL,
    `sale_date` DATE NOT NULL,
    `sale_time` VARCHAR(20) DEFAULT NULL,
    `created_at` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_sales_store` (`store_id`),
    INDEX `idx_sales_invoice` (`invoice_number`),
    INDEX `idx_sales_date` (`sale_date`),
    CONSTRAINT `fk_sales_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `sale_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sale_id` BIGINT NOT NULL,
    `medicine_name` VARCHAR(150) NOT NULL,
    `batch_number` VARCHAR(50) NOT NULL,
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `total_price` DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_sale_items_sale` (`sale_id`),
    INDEX `idx_sale_items_batch` (`batch_number`),
    CONSTRAINT `fk_sale_items_sale` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

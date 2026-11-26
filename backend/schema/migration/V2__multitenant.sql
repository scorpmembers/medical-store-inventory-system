-- One-time, non-destructive migration from the original single-tenant users table.
-- Back up the database before applying. This assumes the pre-migration users all
-- belonged to the one legacy installation because the original schema had no stores.
-- Existing identities and password hashes are retained. The generated store ID is
-- auto-assigned; no existing customer store is selected or reused.

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

ALTER TABLE `users` ADD COLUMN `store_id` BIGINT NULL AFTER `id`;

INSERT INTO `stores` (
    `store_name`, `owner_name`, `phone`, `email`, `address`, `city`, `state`,
    `pincode`, `active`, `created_at`, `updated_at`
)
SELECT
    'Legacy Store - update profile',
    COALESCE(
        (SELECT `name` FROM `users` WHERE `role` = 'ROLE_ADMIN' ORDER BY `id` LIMIT 1),
        (SELECT `name` FROM `users` ORDER BY `id` LIMIT 1),
        'Legacy Owner'
    ),
    '0000000000',
    NULL,
    'Update this address in Store Settings',
    'Update required',
    'Update required',
    '000000',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM `users` WHERE `store_id` IS NULL)
  AND NOT EXISTS (SELECT 1 FROM `stores` WHERE `store_name` = 'Legacy Store - update profile');

UPDATE `users`
SET `store_id` = (
    SELECT `id` FROM `stores`
    WHERE `store_name` = 'Legacy Store - update profile'
    ORDER BY `id` LIMIT 1
)
WHERE `store_id` IS NULL;

ALTER TABLE `users`
    MODIFY COLUMN `store_id` BIGINT NOT NULL,
    ADD INDEX `idx_users_store_id` (`store_id`),
    ADD CONSTRAINT `fk_users_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

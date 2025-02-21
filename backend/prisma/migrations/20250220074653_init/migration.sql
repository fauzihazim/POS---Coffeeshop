-- Step 1: Disable foreign key checks
-- SET FOREIGN_KEY_CHECKS = 0;

-- Create Table User
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `role` ENUM('Manager', 'Barista', 'Customer') NOT NULL,
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Table Supplier
-- Merupakan table supplier
CREATE TABLE `Supplier` (
    `supplierId` INT NOT NULL AUTO_INCREMENT,
    `supplierName` VARCHAR(255) NOT NULL,
    `supplierContact` INT NOT NULL,
    `isBan` ENUM('true', 'false') NOT NULL DEFAULT 'false',
    PRIMARY KEY (`supplierId`),
    UNIQUE (`supplierName`)
);

-- Create Table Item
-- Merupakan table Item
CREATE TABLE `Item` (
    `barcodeItem` INT NOT NULL,
    `itemName` VARCHAR(255) NOT NULL,
    `netto` INT NOT NULL,
    `itemUnit` ENUM('gram', 'milliliters') NOT NULL,
    PRIMARY KEY (`barcodeItem`),
    UNIQUE (`itemName`)
);

-- Create Table ItemIn
-- Merupakan table item yang diterima
-- CREATE TABLE `ItemIn` (
--     `itemInId` INT NOT NULL AUTO_INCREMENT,
--     `barcodeItem` INT NOT NULL,
--     `expired` DATE NOT NULL,
--     `totalItemReceived` INT NOT NULL,
--     `pricePerItem` INT NOT NULL,
--     `dateItemReceived` DATETIME NOT NULL,
--     `supplierId` INT NOT NULL,
--     `receiverId` INT NOT NULL,
--     PRIMARY KEY (`ItemInId`),
--     FOREIGN KEY (`barcodeItem`) REFERENCES `Item`(`barcodeItem`),
--     FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`supplierId`),
--     FOREIGN KEY (`receiverId`) REFERENCES `User`(`userId`),
--     INDEX `idx_expired` (`expired`)
-- );

-- -- Create Table Inventory
-- -- Merupakan Table Persediaan barang, akan dibedakan berdasarkan expired dan barcodeItem
-- CREATE TABLE `Inventory` (
--     `inventoryId` INT NOT NULL AUTO_INCREMENT,
--     `barcodeItem` INT NOT NULL,
--     `itemName` VARCHAR(255) NOT NULL,
--     `itemInId` INT NOT NULL,
--     `expired` DATE NOT NULL,
--     `remainingItem` INT NOT NULL,
--     PRIMARY KEY (`inventoryId`),
--     FOREIGN KEY (`barcodeItem`) REFERENCES `ItemIn`(`barcodeItem`),
--     FOREIGN KEY (`itemName`) REFERENCES `Item`(`itemName`),
--     FOREIGN KEY (`itemInId`) REFERENCES `ItemIn`(`itemInId`),
--     FOREIGN KEY (`expired`) REFERENCES `ItemIn`(`expired`)
-- );

-- Insert initial data
INSERT INTO `User` (username, password, email, firstName, lastName, role)
VALUES
('manager1', '$2y$10$yalMDdaMAiGvBbKypnqY4OyeXWiGlLMpqtL6QoZV2DhUPyKELKeGG', 'emailmanager1@gmail.com', 'manager1firstname', 'manager1lastname', 'Manager'),
('barista1', '$2y$10$uHZ.MtSDAYbWN7sARw8HGOfseWxLcsLYVp2CgJNJvQFWvrsN/nVui', 'emailbarista1@gmail.com', 'barista1firstname', 'barista1lastname', 'Barista'),
('customer1', '$2y$10$ts0AXk.zC2LxiOgXlT.cN.Ks4moPoGptcNIKZkNeBVr/q2bZ.a4Z2', 'emailcustomer1@gmail.com', 'customer1firstname', 'customer1lastname', 'Customer');


INSERT INTO `Supplier` (`supplierName`, `supplierContact`) VALUES
('Supplier 1', 0857901),
('Supplier 2', 0857902);

INSERT INTO `Item` (`barcodeItem`, `itemName`, `netto`, `itemUnit`) VALUES
(909, 'Milk Bendera', 1000, 'milliliters'),
(910, 'Sugar Gulaku', 500, 'gram');

-- INSERT INTO `ItemIn` (`barcodeItem`, `totalItemReceived`, `expired`, `pricePerItem`, `dateItemReceived`, `supplierId`, `receiverId`) VALUES
-- (909, 100, '2025-12-31', '10000', '2025-02-21 10:00:00', 1, 2),
-- (910, 50, '2025-12-30', '25000', '2025-02-21 11:00:00', 2, 1),
-- (909, 20, '2025-12-19', '9500', '2025-02-20 10:00:00', 1, 2);

-- INSERT INTO `Inventory` (`barcodeItem`, `itemName`, `itemInId`, `expired`, `remainingItem`) VALUES
-- (909, 'Milk Bendera', 1, '2025-12-31', 100),
-- (910, 'Sugar Gulaku', 2, '2025-12-30', 50),
-- (909, 'Milk Bendera', 3, '2025-12-19', 20);

-- Step 1: Disable foreign key checks
-- SET FOREIGN_KEY_CHECKS = 1;
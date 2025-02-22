/*
  Warnings:

  - You are about to drop the column `barcode` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `inventory` table. All the data in the column will be lost.
  - Added the required column `barcodeItem` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemInId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemName` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingItem` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inventory` DROP COLUMN `barcode`,
    DROP COLUMN `supplierId`,
    ADD COLUMN `barcodeItem` INTEGER NOT NULL,
    ADD COLUMN `itemInId` INTEGER NOT NULL,
    ADD COLUMN `itemName` VARCHAR(191) NOT NULL,
    ADD COLUMN `remainingItem` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Supplier` (
    `supplierId` INTEGER NOT NULL AUTO_INCREMENT,
    `supplierName` VARCHAR(191) NOT NULL,
    `supplierContact` INTEGER NOT NULL,
    `isBan` ENUM('true', 'false') NOT NULL DEFAULT 'false',

    UNIQUE INDEX `Supplier_supplierName_key`(`supplierName`),
    PRIMARY KEY (`supplierId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `barcodeItem` INTEGER NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `netto` INTEGER NOT NULL,
    `itemUnit` ENUM('gram', 'milliliters') NOT NULL,

    UNIQUE INDEX `Item_itemName_key`(`itemName`),
    PRIMARY KEY (`barcodeItem`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemIn` (
    `itemInId` INTEGER NOT NULL AUTO_INCREMENT,
    `barcodeItem` INTEGER NOT NULL,
    `expired` DATETIME(3) NOT NULL,
    `totalItemReceived` INTEGER NOT NULL,
    `pricePerItem` INTEGER NOT NULL,
    `dateItemReceived` DATETIME(3) NOT NULL,
    `supplierId` INTEGER NOT NULL,
    `receiverId` INTEGER NOT NULL,

    INDEX `idx_expired`(`expired`),
    PRIMARY KEY (`itemInId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_barcodeItem` ON `Inventory`(`barcodeItem`);

-- CreateIndex
CREATE INDEX `idx_itemName` ON `Inventory`(`itemName`);

-- CreateIndex
CREATE INDEX `idx_expired` ON `Inventory`(`expired`);

-- AddForeignKey
ALTER TABLE `ItemIn` ADD CONSTRAINT `ItemIn_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`supplierId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemIn` ADD CONSTRAINT `ItemIn_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemIn` ADD CONSTRAINT `ItemIn_barcodeItem_fkey` FOREIGN KEY (`barcodeItem`) REFERENCES `Item`(`barcodeItem`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_itemInId_fkey` FOREIGN KEY (`itemInId`) REFERENCES `ItemIn`(`itemInId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_barcodeItem_fkey` FOREIGN KEY (`barcodeItem`) REFERENCES `Item`(`barcodeItem`) ON DELETE RESTRICT ON UPDATE CASCADE;

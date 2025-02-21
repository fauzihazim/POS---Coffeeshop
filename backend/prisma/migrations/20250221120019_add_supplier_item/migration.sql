/*
  Warnings:

  - You are about to alter the column `username` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `firstName` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `lastName` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the `item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `username` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `firstName` VARCHAR(191) NOT NULL,
    MODIFY `lastName` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `item`;

-- DropTable
DROP TABLE `supplier`;

-- CreateTable
CREATE TABLE `inventory` (
    `inventoryId` INTEGER NOT NULL AUTO_INCREMENT,
    `barcode` INTEGER NOT NULL,
    `expired` DATETIME(3) NOT NULL,
    `supplierId` INTEGER NOT NULL,

    PRIMARY KEY (`inventoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

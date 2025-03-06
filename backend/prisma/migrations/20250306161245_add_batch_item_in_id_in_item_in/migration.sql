/*
  Warnings:

  - The primary key for the `itemin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `itemInId` on the `itemin` table. All the data in the column will be lost.
  - Added the required column `batchItemInId` to the `ItemIn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemInid` to the `ItemIn` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `inventory` DROP FOREIGN KEY `Inventory_itemInId_fkey`;

-- DropIndex
DROP INDEX `Inventory_itemInId_fkey` ON `inventory`;

-- AlterTable
ALTER TABLE `inventory` ADD COLUMN `status` ENUM('available', 'expired', 'outOfStock') NOT NULL DEFAULT 'available';

-- AlterTable
ALTER TABLE `itemin` DROP PRIMARY KEY,
    DROP COLUMN `itemInId`,
    ADD COLUMN `batchItemInId` INTEGER NOT NULL,
    ADD COLUMN `itemInid` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`itemInid`);

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_itemInId_fkey` FOREIGN KEY (`itemInId`) REFERENCES `ItemIn`(`itemInid`) ON DELETE RESTRICT ON UPDATE CASCADE;

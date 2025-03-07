/*
  Warnings:

  - You are about to drop the column `itemName` on the `inventory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `idx_itemName` ON `inventory`;

-- AlterTable
ALTER TABLE `inventory` DROP COLUMN `itemName`;

/*
  Warnings:

  - You are about to alter the column `isBan` on the `supplier` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `supplier` MODIFY `isBan` ENUM('true', 'false') NOT NULL DEFAULT 'false';

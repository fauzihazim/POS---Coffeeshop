/*
  Warnings:

  - You are about to alter the column `isBan` on the `supplier` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `supplier` MODIFY `isBan` BOOLEAN NOT NULL DEFAULT false;

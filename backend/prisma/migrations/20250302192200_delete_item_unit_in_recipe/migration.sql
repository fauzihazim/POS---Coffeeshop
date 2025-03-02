/*
  Warnings:

  - You are about to drop the column `itemUnit` on the `recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `menu` MODIFY `status` ENUM('available', 'soldOut', 'removed', 'recipeChange') NOT NULL DEFAULT 'available';

-- AlterTable
ALTER TABLE `recipe` DROP COLUMN `itemUnit`;

-- CreateTable
CREATE TABLE `Menu` (
    `menuId` INTEGER NOT NULL AUTO_INCREMENT,
    `menuName` VARCHAR(191) NOT NULL,
    `menuDescription` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `status` ENUM('available', 'soldOut', 'removed') NOT NULL DEFAULT 'available',

    UNIQUE INDEX `Menu_menuName_key`(`menuName`),
    PRIMARY KEY (`menuId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `menuId` INTEGER NOT NULL,
    `barcodeItem` INTEGER NOT NULL,
    `quantity` DECIMAL(65, 30) NOT NULL,
    `itemUnit` ENUM('gram', 'milliliters') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`menuId`) ON DELETE RESTRICT ON UPDATE CASCADE;

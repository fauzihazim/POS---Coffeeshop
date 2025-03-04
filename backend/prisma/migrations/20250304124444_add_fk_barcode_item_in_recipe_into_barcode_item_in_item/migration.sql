-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_barcodeItem_fkey` FOREIGN KEY (`barcodeItem`) REFERENCES `Item`(`barcodeItem`) ON DELETE RESTRICT ON UPDATE CASCADE;

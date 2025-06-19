-- DropForeignKey
ALTER TABLE `PropertyPhoto` DROP FOREIGN KEY `PropertyPhoto_propertyId_fkey`;

-- AddForeignKey
ALTER TABLE `PropertyPhoto` ADD CONSTRAINT `PropertyPhoto_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

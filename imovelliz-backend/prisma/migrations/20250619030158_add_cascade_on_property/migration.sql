-- DropForeignKey
ALTER TABLE `Favorite` DROP FOREIGN KEY `Favorite_propertyId_fkey`;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

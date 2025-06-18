import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { FavoritesService } from './favorites.service';

@Module({
  providers: [PropertyService, PrismaService, FavoritesService],
  exports: [PropertyService],
  controllers: [PropertyController],
})
export class PropertyModule {}

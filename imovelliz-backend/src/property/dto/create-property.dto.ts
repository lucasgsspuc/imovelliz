import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { PropertyStatus, PropertyType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsString() address: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsOptional() @IsString() zipCode?: string;
  @IsOptional() @Type(() => Number) latitude?: number;
  @IsOptional() @Type(() => Number) longitude?: number;
  @IsEnum(PropertyType) type: PropertyType;
  @IsOptional() @IsEnum(PropertyStatus) status?: PropertyStatus;
  @IsOptional() @Type(() => Number) price: number;
  @IsOptional() @Type(() => Number) area?: number;
  @IsOptional() @Type(() => Number) bedrooms?: number;
  @IsOptional() @Type(() => Number) bathrooms?: number;
  @IsOptional() @Type(() => Number) parkingSpaces?: number;
  @IsOptional() @Type(() => Boolean) furnished?: boolean;

  @IsArray()
  @IsOptional()
  files?: Express.Multer.File[];
}

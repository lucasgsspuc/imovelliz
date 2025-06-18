import { IsString, IsBoolean } from 'class-validator';

export class CreatePropertyPhotoDto {
  @IsString() url: string;
  @IsBoolean() isMain: boolean;
  @IsString() propertyId: string;
}

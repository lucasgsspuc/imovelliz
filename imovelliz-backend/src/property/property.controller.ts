import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Public } from 'src/auth/guards/auth.guard';
import { CreatePropertyPhotoDto } from './dto/create-property-photo.dto';
import { FavoritesService } from './favorites.service';
import { Favorite } from '@prisma/client';
import { RequestWithUser } from 'src/auth/dto/request.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post('favorites')
  async createFavorite(
    @Request() req: RequestWithUser,
    @Body() body: { propertyId: string },
  ): Promise<Favorite> {
    return this.favoritesService.createFavorite(req.user, body.propertyId);
  }

  @Get('favorites')
  async getUserFavorites(@Request() req: RequestWithUser): Promise<Favorite[]> {
    return this.favoritesService.getUserFavorites(req.user.username);
  }

  @Delete('favorites/:propertyId')
  @HttpCode(204)
  async removeFavorite(
    @Request() req: RequestWithUser,
    @Param('propertyId') propertyId: string,
  ): Promise<void> {
    return this.favoritesService.removeFavorite(req.user.username, propertyId);
  }

  @Post()
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @Request() req: RequestWithUser,
  ) {
    console.log('Request files:', req['files']); // Depuração
    if (req['files'] && Array.isArray(req['files'])) {
      createPropertyDto.files = req['files'] as Express.Multer.File[];
    }
    return this.propertyService.create(createPropertyDto, req.user);
  }

  @Post('photo')
  addPhoto(@Body() createPhotoDto: CreatePropertyPhotoDto) {
    return this.propertyService.addPhoto(createPhotoDto);
  }

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Get('user')
  findUserProperties(@Request() req: RequestWithUser) {
    return this.propertyService.findAllByUser(req.user);
  }

  @Public()
  @Get('home')
  findForHome() {
    return this.propertyService.findForHome();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  /* @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(id, updatePropertyDto);
  } */

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}

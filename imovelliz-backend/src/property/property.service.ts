import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/prisma.service';
import { CreatePropertyPhotoDto } from './dto/create-property-photo.dto';
import { User } from '@prisma/client';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePropertyDto, user: User) {
    const property = await this.prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        latitude: data.latitude,
        longitude: data.longitude,
        type: data.type,
        status: data.status,
        price: data.price,
        area: data.area,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parkingSpaces: data.parkingSpaces,
        furnished: data.furnished,
        owner: {
          connect: { username: user.username },
        },
      },
    });

    if (data.files && data.files.length > 0) {
      const photos = data.files.map((file) => ({
        url: `http://localhost:9000/uploads/${file.filename}`, // URL base do servidor
        propertyId: property.id,
      }));
      await this.prisma.propertyPhoto.createMany({
        data: photos,
      });
    }
  }

  findAll() {
    return this.prisma.property.findMany({
      include: {
        photos: true,
        owner: true,
      },
    });
  }

  findAllByUser(user: User) {
    return this.prisma.property.findMany({
      include: {
        photos: true,
        owner: true,
      },
      where: {
        owner: { username: user.username },
      },
    });
  }

  findForHome() {
    return this.prisma.property.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      where: {
        status: 'AVAILABLE',
      },
      select: {
        id: true,
        title: true,
        area: true,
        price: true,
        address: true,
        description: true,
        city: true,
        state: true,
        bedrooms: true,
        parkingSpaces: true,
        photos: {
          where: { isMain: true },
          select: {
            url: true,
          },
        },
      },
    });
  }

  addPhoto(data: CreatePropertyPhotoDto) {
    return this.prisma.propertyPhoto.create({ data });
  }

  findOne(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        photos: true,
        owner: true,
      },
    });
  }

  async update(id: string, updatePropertyDto: CreatePropertyDto): Promise<any> {
    // Primeiro atualiza a propriedade
    const updatedProperty = await this.prisma.property.update({
      where: { id },
      data: {
        title: updatePropertyDto.title,
        description: updatePropertyDto.description,
        price: updatePropertyDto.price,
        type: updatePropertyDto.type,
        address: updatePropertyDto.address,
        city: updatePropertyDto.city,
        state: updatePropertyDto.state,
        area: updatePropertyDto.area,
        bedrooms: updatePropertyDto.bedrooms,
        bathrooms: updatePropertyDto.bathrooms,
        furnished: updatePropertyDto.furnished,
        parkingSpaces: updatePropertyDto.parkingSpaces,
        latitude: updatePropertyDto.latitude || 0,
        longitude: updatePropertyDto.longitude || 0,
      },
      include: { photos: true },
    });

    // Se houver novos arquivos, adiciona as novas fotos
    if (updatePropertyDto.files && updatePropertyDto.files.length > 0) {
      const newPhotos = updatePropertyDto.files.map((file) => ({
        filename: file.filename,
        url: `http://localhost:9000/uploads/${file.filename}`,
        propertyId: id,
      }));
      await this.prisma.propertyPhoto.createMany({
        data: newPhotos,
      });
    }

    return updatedProperty;
  }

  remove(id: string) {
    return this.prisma.property.delete({
      where: { id },
    });
  }
}

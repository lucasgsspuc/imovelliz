import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Favorite } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async createFavorite(userId: string, propertyId: string): Promise<Favorite> {
    // Verificar se o imóvel existe
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      throw new NotFoundException('Imóvel não encontrado');
    }

    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o imóvel já está favoritado
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });
    if (existingFavorite) {
      throw new ConflictException('Este imóvel já está favoritado');
    }

    // Criar o favorito
    return this.prisma.favorite.create({
      data: {
        userId,
        propertyId,
      },
    });
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Listar favoritos com detalhes do imóvel
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            photos: { where: { isMain: true }, take: 1 }, // Incluir a foto principal
          },
        },
      },
    });
  }

  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    // Verificar se o favorito existe
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });
    if (!favorite) {
      throw new NotFoundException('Favorito não encontrado');
    }

    // Remover o favorito
    await this.prisma.favorite.delete({
      where: { userId_propertyId: { userId, propertyId } },
    });
  }
}

import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Favorite, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async createFavorite(authUser: User, propertyId: string): Promise<Favorite> {
    // Verificar se o imóvel existe
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      throw new NotFoundException('Imóvel não encontrado');
    }

    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { username: authUser.username },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o imóvel já está favoritado
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: { userId_propertyId: { userId: user.id, propertyId } },
    });
    if (existingFavorite) {
      await this.prisma.favorite.delete({
        where: { userId_propertyId: { userId: user.id, propertyId } },
      });
      return;
    }

    // Criar o favorito
    return this.prisma.favorite.create({
      data: {
        userId: user.id,
        propertyId,
      },
    });
  }

  async getUserFavorites(username: string): Promise<Favorite[]> {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Listar favoritos com detalhes do imóvel
    return this.prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        property: {
          include: {
            photos: true,
          },
        },
      },
    });
  }

  async removeFavorite(username: string, propertyId: string): Promise<void> {
    // Verificar se o favorito existe
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_propertyId: { userId: user.id, propertyId } },
    });
    if (!favorite) {
      throw new NotFoundException('Favorito não encontrado');
    }

    // Remover o favorito
    await this.prisma.favorite.delete({
      where: { userId_propertyId: { userId: user.id, propertyId } },
    });
  }
}

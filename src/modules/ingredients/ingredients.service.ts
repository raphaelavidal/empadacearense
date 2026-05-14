import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';

import { CreateIngredientDto } from './dto/create-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateIngredientDto) {
    return this.prisma.ingredient.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.ingredient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.ingredient.findUnique({
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.ingredient.delete({
      where: { id },
    });
  }
}

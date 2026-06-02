import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';

import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { FindIngredientsQueryDto } from './dto/find-ingredients-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateIngredientDto) {
    return this.prisma.ingredient.create({
      data,
    });
  }

  async findAll(query: FindIngredientsQueryDto = {}) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.ingredient.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.ingredient.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: number) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
    });
    if (!ingredient) {
      throw new NotFoundException(`Ingrediente com ID ${id} não encontrado.`);
    }
    return ingredient;
  }

  async remove(id: number) {
    try {
      return await this.prisma.ingredient.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Ingrediente com ID ${id} não encontrado para exclusão.`);
      }
      throw error;
    }
  }
}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeResponseDto } from './dto/recipe-response.dto';
import { FindRecipesQueryDto } from './dto/find-recipes-query.dto';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRecipeDto): Promise<RecipeResponseDto> {
    const { ingredients, steps, ...recipeData } = dto;

    // 1. Validar se todos os ingredientes informados realmente existem no banco de dados
    const uniqueIngredientIds = Array.from(
      new Set(ingredients.map(ing => ing.ingredientId))
    );

    const existingIngredients = await this.prisma.ingredient.findMany({
      where: {
        id: {
          in: uniqueIngredientIds,
        },
      },
      select: {
        id: true,
      },
    });

    const existingIds = existingIngredients.map(ing => ing.id);
    const missingIds = uniqueIngredientIds.filter(id => !existingIds.includes(id));

    if (missingIds.length > 0) {
      throw new BadRequestException(
        `Cadastro bloqueado: Os seguintes ingredientes não foram encontrados no banco de dados: [${missingIds.join(', ')}].`
      );
    }

    // 2. Persistir a receita no banco
    const recipe = await this.prisma.recipe.create({
      data: {
        ...recipeData,
        ingredients: {
          create: ingredients.map(ing => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
          })),
        },
        steps: {
          create: steps.map(step => ({
            order: step.order,
            description: step.description,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // 3. Mapear o retorno para a estrutura limpa e achatada do RecipeResponseDto
    return this.mapToResponse(recipe);
  }

  async findAll(query: FindRecipesQueryDto = {}) {
    const { page = 1, limit = 10, category } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};
    if (category) {
      where.category = {
        equals: category,
        mode: 'insensitive',
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        skip,
        take,
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
          steps: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.recipe.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map(recipe => this.mapToResponse(recipe)),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: number): Promise<RecipeResponseDto> {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Receita com ID ${id} não encontrada.`);
    }

    return this.mapToResponse(recipe);
  }

  private mapToResponse(recipe: any): RecipeResponseDto {
    const ingredients = recipe.ingredients || [];
    const hasNova4 = ingredients.some(ri => ri.ingredient?.novaClassification === 'NOVA_4');
    const hasNova3 = ingredients.some(ri => ri.ingredient?.novaClassification === 'NOVA_3');

    let classification: 'Natural' | 'Processada' | 'Contém ultraprocessados' = 'Natural';
    if (hasNova4) {
      classification = 'Contém ultraprocessados';
    } else if (hasNova3) {
      classification = 'Processada';
    }

    return {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description || undefined,
      yield: Number(recipe.yield),
      yieldUnit: recipe.yieldUnit,
      prepTime: recipe.prepTime,
      category: recipe.category,
      prepMethod: recipe.prepMethod || undefined,
      classification,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
      ingredients: ingredients.map(ri => ({
        id: ri.ingredient.id,
        name: ri.ingredient.name,
        brand: ri.ingredient.brand || undefined,
        unit: ri.ingredient.unit,
        novaClassification: ri.ingredient.novaClassification,
        compositionLabel: ri.ingredient.compositionLabel,
        isNovaVerified: ri.ingredient.isNovaVerified,
        quantity: Number(ri.quantity),
      })),
      steps: recipe.steps ? recipe.steps.map(step => ({
        id: step.id,
        order: step.order,
        description: step.description,
      })) : [],
    };
  }
}

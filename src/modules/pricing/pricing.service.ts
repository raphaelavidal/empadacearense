import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { RecipeCostResponseDto, RecipeIngredientCostDto } from './dto/recipe-cost-response.dto';
import { UpdateOperationalCostConfigDto } from './dto/update-config.dto';
import { OperationalCostConfigResponseDto } from './dto/config-response.dto';

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateRecipeBaseCost(recipeId: number): Promise<RecipeCostResponseDto> {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Receita com ID ${recipeId} não encontrada.`);
    }

    const recipeYield = Number(recipe.yield);
    const prepTime = Number(recipe.prepTime);

    // Buscar a configuração financeira atual (ou criar a padrão se não existir)
    const config = await this.getConfig();

    // 1. Calcular o custo total dos ingredientes (CMV de ingredientes)
    let totalBaseCost = 0;
    let ingredientsCosts: RecipeIngredientCostDto[] = [];

    if (recipe.ingredients && recipe.ingredients.length > 0) {
      ingredientsCosts = recipe.ingredients.map(ri => {
        const quantityUsed = Number(ri.quantity);
        const purchasePrice = Number(ri.ingredient.purchasePrice);
        const purchaseQuantity = Number(ri.ingredient.purchaseQuantity);

        let proportionalCost = 0;
        if (purchaseQuantity > 0) {
          proportionalCost = Number(((purchasePrice / purchaseQuantity) * quantityUsed).toFixed(2));
        }

        return {
          ingredientId: ri.ingredient.id,
          name: ri.ingredient.name,
          quantityUsed,
          unit: ri.ingredient.unit,
          proportionalCost,
        };
      });

      totalBaseCost = Number(
        ingredientsCosts.reduce((sum, item) => sum + item.proportionalCost, 0).toFixed(2)
      );
    }

    const unitBaseCost = recipeYield > 0 ? Number((totalBaseCost / recipeYield).toFixed(2)) : 0;

    // 2. Calcular o custo de Mão de Obra
    // Formula: (prepTime / 60) * hourlyRate
    const laborCost = Number(((prepTime / 60) * config.hourlyRate).toFixed(2));

    // 3. Calcular custos operacionais indiretos (taxa operacional calculada sobre o CMV de ingredientes)
    const operationalCost = Number((totalBaseCost * (config.operationalTax / 100)).toFixed(2));

    // 4. Custo de embalagem
    const packagingCost = config.packagingCost;

    // 5. Custo total de produção (CMV + mão de obra + custos operacionais + embalagem)
    const totalProductionCost = Number(
      (totalBaseCost + laborCost + operationalCost + packagingCost).toFixed(2)
    );

    // 6. Margem de lucro aplicada
    const profitAmount = Number((totalProductionCost * (config.profitMargin / 100)).toFixed(2));

    // 7. Preço total sugerido e preço unitário sugerido
    const suggestedPrice = Number((totalProductionCost + profitAmount).toFixed(2));
    const unitSuggestedPrice = recipeYield > 0 ? Number((suggestedPrice / recipeYield).toFixed(2)) : 0;

    return {
      recipeId: recipe.id,
      recipeName: recipe.name,
      yield: recipeYield,
      yieldUnit: recipe.yieldUnit,
      totalBaseCost,
      unitBaseCost,
      laborCost,
      operationalCost,
      packagingCost,
      totalProductionCost,
      profitAmount,
      suggestedPrice,
      unitSuggestedPrice,
      ingredients: ingredientsCosts,
    };
  }

  async getConfig(): Promise<OperationalCostConfigResponseDto> {
    let config = await this.prisma.operationalCostConfig.findFirst({
      orderBy: { id: 'asc' },
    });

    if (!config) {
      config = await this.prisma.operationalCostConfig.create({
        data: {
          hourlyRate: 20.00,
          profitMargin: 100.00,
          operationalTax: 15.00,
          packagingCost: 1.00,
        },
      });
    }

    return this.mapConfigToResponse(config);
  }

  async updateConfig(dto: UpdateOperationalCostConfigDto): Promise<OperationalCostConfigResponseDto> {
    const existing = await this.prisma.operationalCostConfig.findFirst({
      orderBy: { id: 'asc' },
    });

    let config;
    if (existing) {
      config = await this.prisma.operationalCostConfig.update({
        where: { id: existing.id },
        data: dto,
      });
    } else {
      config = await this.prisma.operationalCostConfig.create({
        data: dto,
      });
    }

    return this.mapConfigToResponse(config);
  }

  private mapConfigToResponse(config: any): OperationalCostConfigResponseDto {
    return {
      id: config.id,
      hourlyRate: Number(config.hourlyRate),
      profitMargin: Number(config.profitMargin),
      operationalTax: Number(config.operationalTax),
      packagingCost: Number(config.packagingCost),
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { UnitType } from '@prisma/client';

export class RecipeIngredientCostDto {
  @ApiProperty({ description: 'ID do ingrediente (insumo)', example: 1 })
  ingredientId: number;

  @ApiProperty({ description: 'Nome do ingrediente', example: 'Manteiga' })
  name: string;

  @ApiProperty({ description: 'Quantidade exata do ingrediente utilizada na receita', example: 250.00 })
  quantityUsed: number;

  @ApiProperty({ description: 'Unidade de medida', enum: UnitType, example: UnitType.G })
  unit: UnitType;

  @ApiProperty({ description: 'Custo proporcional do ingrediente na receita', example: 7.25 })
  proportionalCost: number;
}

export class RecipeCostResponseDto {
  @ApiProperty({ description: 'ID único da receita', example: 1 })
  recipeId: number;

  @ApiProperty({ description: 'Nome da receita', example: 'Empada Cearense Clássica' })
  recipeName: string;

  @ApiProperty({ description: 'Rendimento total da receita', example: 12.00 })
  yield: number;

  @ApiProperty({ description: 'Unidade de medida do rendimento', enum: UnitType, example: UnitType.UNIT })
  yieldUnit: UnitType;

  @ApiProperty({ description: 'Custo total proporcional de ingredientes (CMV)', example: 18.50 })
  totalBaseCost: number;

  @ApiProperty({ description: 'Custo unitário base dos ingredientes', example: 1.54 })
  unitBaseCost: number;

  @ApiProperty({ description: 'Custo proporcional de mão de obra baseado no tempo de preparo', example: 18.75 })
  laborCost: number;

  @ApiProperty({ description: 'Custo operacional de taxas indiretas calculadas sobre o CMV', example: 2.78 })
  operationalCost: number;

  @ApiProperty({ description: 'Custo de embalagem aplicado à receita', example: 1.50 })
  packagingCost: number;

  @ApiProperty({ description: 'Custo total de produção (CMV + mão de obra + taxas + embalagem)', example: 41.53 })
  totalProductionCost: number;

  @ApiProperty({ description: 'Valor correspondente à margem de lucro aplicada', example: 41.53 })
  profitAmount: number;

  @ApiProperty({ description: 'Preço total sugerido de venda com a margem aplicada', example: 83.06 })
  suggestedPrice: number;

  @ApiProperty({ description: 'Preço unitário de venda sugerido', example: 6.92 })
  unitSuggestedPrice: number;

  @ApiProperty({ description: 'Lista detalhada de custos de cada ingrediente utilizado', type: [RecipeIngredientCostDto] })
  ingredients: RecipeIngredientCostDto[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitType, NovaClassification } from '@prisma/client';

export class RecipeIngredientResponseDto {
  @ApiProperty({ description: 'ID do ingrediente (insumo)', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome do ingrediente', example: 'Farinha de Aveia' })
  name: string;

  @ApiPropertyOptional({ description: 'Marca do ingrediente', example: 'Sabor Natural' })
  brand?: string;

  @ApiProperty({ description: 'Unidade de medida', enum: UnitType, example: UnitType.KG })
  unit: UnitType;

  @ApiProperty({ description: 'Classificação NOVA de processamento alimentar', enum: NovaClassification, example: NovaClassification.NOVA_1 })
  novaClassification: NovaClassification;

  @ApiProperty({ description: 'Composição textual do ingrediente contida no rótulo', example: 'Farinha de aveia integral sem glúten.' })
  compositionLabel: string;

  @ApiProperty({ description: 'Indica se a classificação NOVA foi verificada e auditada', example: false })
  isNovaVerified: boolean;

  @ApiProperty({ description: 'Quantidade exata utilizada na receita', example: 0.25 })
  quantity: number;
}

export class RecipeStepResponseDto {
  @ApiProperty({ description: 'ID do passo', example: 1 })
  id: number;

  @ApiProperty({ description: 'Ordem cronológica do passo', example: 1 })
  order: number;

  @ApiProperty({ description: 'Descrição textual do passo', example: 'Misture a farinha e a manteiga.' })
  description: string;
}

export class RecipeResponseDto {
  @ApiProperty({ description: 'ID único da receita', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da receita', example: 'Empada Cearense Clássica' })
  name: string;

  @ApiPropertyOptional({ description: 'Descrição da receita', example: 'Empada tradicional folhada.' })
  description?: string;

  @ApiProperty({ description: 'Rendimento da receita', example: 12.00 })
  yield: number;

  @ApiProperty({ description: 'Unidade de medida do rendimento', enum: UnitType, example: UnitType.UNIT })
  yieldUnit: UnitType;

  @ApiProperty({ description: 'Tempo de preparo em minutos', example: 45 })
  prepTime: number;

  @ApiProperty({ description: 'Categoria da receita', example: 'Salgados' })
  category: string;

  @ApiPropertyOptional({ description: 'Modo de preparo passo a passo (opcional)', example: '1. Abra a massa...' })
  prepMethod?: string;

  @ApiProperty({
    description: 'Classificação nutricional consolidada da receita com base na presença de ultraprocessados',
    example: 'Natural',
    enum: ['Natural', 'Processada', 'Contém ultraprocessados'],
  })
  classification: 'Natural' | 'Processada' | 'Contém ultraprocessados';

  @ApiProperty({ description: 'Lista de ingredientes associados de forma achatada', type: [RecipeIngredientResponseDto] })
  ingredients: RecipeIngredientResponseDto[];

  @ApiProperty({ description: 'Lista de passos estruturados do preparo', type: [RecipeStepResponseDto] })
  steps: RecipeStepResponseDto[];

  @ApiProperty({ description: 'Data de criação da receita' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de última atualização da receita' })
  updatedAt: Date;
}

import { IsString, IsNotEmpty, IsNumber, Min, IsEnum, IsArray, ValidateNested, ArrayMinSize, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitType } from '@prisma/client';

export class RecipeStepInputDto {
  @ApiProperty({
    description: 'Ordem cronológica do passo de preparo (começando em 1)',
    example: 1,
  })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({
    description: 'Descrição textual detalhada da instrução do passo',
    example: 'Misture a farinha de trigo com a manteiga até obter uma massa homogênea.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class RecipeIngredientInputDto {
  @ApiProperty({
    description: 'ID do ingrediente (insumo) existente no banco de dados',
    example: 1,
  })
  @IsNumber()
  ingredientId: number;

  @ApiProperty({
    description: 'Quantidade exata do ingrediente utilizada na receita',
    example: 250.00,
  })
  @IsNumber()
  @Min(0.01)
  quantity: number;
}

export class CreateRecipeDto {
  @ApiProperty({
    description: 'Nome da receita',
    example: 'Empada Cearense Clássica',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição ou notas sobre a receita',
    example: 'Empada de massa folhada com recheio tradicional de frango e temperos cearenses.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Rendimento total da receita',
    example: 12.00,
  })
  @IsNumber()
  @Min(0.01)
  yield: number;

  @ApiProperty({
    description: 'Unidade de medida do rendimento',
    enum: UnitType,
    example: UnitType.UNIT,
  })
  @IsEnum(UnitType)
  yieldUnit: UnitType;

  @ApiProperty({
    description: 'Tempo total de preparo em minutos (não aceita valor negativo)',
    example: 45,
  })
  @IsNumber()
  @Min(0)
  prepTime: number;

  @ApiProperty({
    description: 'Categoria da receita',
    example: 'Salgados',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({
    description: 'Modo de preparo textual resumido (opcional)',
    example: '1. Misture a farinha e a manteiga para a massa. 2. Abra na forma e adicione o recheio...',
  })
  @IsString()
  @IsOptional()
  prepMethod?: string;

  @ApiProperty({
    description: 'Lista de ingredientes e suas respectivas quantidades',
    type: [RecipeIngredientInputDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientInputDto)
  @ArrayMinSize(1)
  ingredients: RecipeIngredientInputDto[];

  @ApiProperty({
    description: 'Lista de passos estruturados do preparo',
    type: [RecipeStepInputDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeStepInputDto)
  @ArrayMinSize(1)
  steps: RecipeStepInputDto[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitType, NovaClassification } from '@prisma/client';

export class IngredientResponseDto {
  @ApiProperty({ description: 'ID único do ingrediente no banco de dados', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome do ingrediente', example: 'Farinha de Aveia' })
  name: string;

  @ApiPropertyOptional({ description: 'Marca do ingrediente', example: 'Sabor Natural' })
  brand?: string;

  @ApiProperty({ description: 'Unidade de medida', enum: UnitType, example: UnitType.KG })
  unit: UnitType;

  @ApiProperty({ description: 'Classificação NOVA do ingrediente (NOVA_1 a NOVA_4)', enum: NovaClassification, example: NovaClassification.NOVA_1 })
  novaClassification: NovaClassification;

  @ApiProperty({ description: 'Composição descrita integralmente no rótulo', example: 'Farinha de aveia integral fina sem glúten.' })
  compositionLabel: string;

  @ApiProperty({ description: 'Indica se a classificação NOVA foi verificada e auditada', example: false })
  isNovaVerified: boolean;

  @ApiProperty({ description: 'Preço de compra do ingrediente', example: 15.50 })
  purchasePrice: number;

  @ApiProperty({ description: 'Quantidade no pacote de compra', example: 1.00 })
  purchaseQuantity: number;

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date;
}

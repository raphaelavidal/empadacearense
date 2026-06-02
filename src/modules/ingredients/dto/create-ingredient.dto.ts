import { NovaClassification } from '@prisma/client';
import { UnitType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateIngredientDto {
    @ApiProperty({
        description: 'Nome do ingrediente',
        example: 'Farinha de Aveia',
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'Marca do ingrediente',
        example: 'Sabor Natural',
    })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiProperty({
        description: 'Unidade de medida',
        enum: UnitType,
        example: UnitType.KG,
    })
    @IsEnum(UnitType)
    unit: UnitType;

    @ApiProperty({
        description: 'Classificação NOVA do ingrediente (NOVA_1 a NOVA_4)',
        enum: NovaClassification,
        example: NovaClassification.NOVA_1,
    })
    @IsEnum(NovaClassification)
    novaClassification: NovaClassification;

    @ApiProperty({
        description: 'Composição descrita no rótulo do ingrediente',
        example: 'Farinha de aveia integral fina sem glúten.',
    })
    @IsString()
    compositionLabel: string;

    @ApiPropertyOptional({
        description: 'Indica se a classificação NOVA foi auditada/verificada manualmente',
        default: false,
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    isNovaVerified?: boolean;

    @ApiProperty({
        description: 'Preço pago na compra do ingrediente',
        example: 15.50,
    })
    @IsNumber()
    purchasePrice: number;

    @ApiProperty({
        description: 'Quantidade adquirida no pacote de compra',
        example: 1.00,
    })
    @IsNumber()
    purchaseQuantity: number;
}
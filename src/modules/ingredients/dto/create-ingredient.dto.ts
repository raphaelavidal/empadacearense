import { NovaClassification } from '@prisma/client';
import { UnitType } from '@prisma/client';
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateIngredientDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    brand?: string;

    @IsEnum(UnitType)
    unit: UnitType;

    @IsEnum(NovaClassification)
    novaClassification: NovaClassification;

    @IsString()
    compositionLabel: string;

    @IsOptional()
    @IsBoolean()
    isNovaVerified?: boolean;

    @IsNumber()
    purchasePrice: number;

    @IsNumber()
    purchaseQuantity: number;
}
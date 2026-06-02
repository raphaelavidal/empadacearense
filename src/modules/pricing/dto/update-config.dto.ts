import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateOperationalCostConfigDto {
  @ApiProperty({ description: 'Valor da hora de trabalho do confeiteiro (não aceita valor negativo)', example: 25.00 })
  @IsNumber()
  @Min(0)
  hourlyRate: number;

  @ApiProperty({ description: 'Margem de lucro desejada em porcentagem (não aceita valor negativo)', example: 100.00 })
  @IsNumber()
  @Min(0)
  profitMargin: number;

  @ApiProperty({ description: 'Taxa operacional de custos indiretos em porcentagem (não aceita valor negativo)', example: 15.00 })
  @IsNumber()
  @Min(0)
  operationalTax: number;

  @ApiProperty({ description: 'Custo unitário de embalagem (não aceita valor negativo)', example: 1.50 })
  @IsNumber()
  @Min(0)
  packagingCost: number;
}

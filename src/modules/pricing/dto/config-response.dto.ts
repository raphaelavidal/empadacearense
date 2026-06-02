import { ApiProperty } from '@nestjs/swagger';

export class OperationalCostConfigResponseDto {
  @ApiProperty({ description: 'ID da configuração', example: 1 })
  id: number;

  @ApiProperty({ description: 'Valor hora do confeiteiro', example: 25.00 })
  hourlyRate: number;

  @ApiProperty({ description: 'Margem de lucro em porcentagem', example: 100.00 })
  profitMargin: number;

  @ApiProperty({ description: 'Taxa operacional em porcentagem', example: 15.00 })
  operationalTax: number;

  @ApiProperty({ description: 'Custo de embalagem', example: 1.50 })
  packagingCost: number;

  @ApiProperty({ description: 'Data de criação da configuração' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização da configuração' })
  updatedAt: Date;
}

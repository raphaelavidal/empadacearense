import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { RecipeCostResponseDto } from './dto/recipe-cost-response.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('pricing')
@Controller('recipes')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @ApiOperation({ summary: 'Calcula o custo base proporcional de ingredientes da receita (CMV).' })
  @ApiResponse({ status: 200, description: 'Custo calculado com sucesso.', type: RecipeCostResponseDto })
  @ApiResponse({ status: 404, description: 'Receita não encontrada.' })
  @ApiParam({ name: 'id', description: 'ID da receita para cálculo de custo', type: Number })
  @Get(':id/cost')
  calculateCost(@Param('id', ParseIntPipe) id: number): Promise<RecipeCostResponseDto> {
    return this.pricingService.calculateRecipeBaseCost(id);
  }
}

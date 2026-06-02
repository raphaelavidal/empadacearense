import { Controller, Get, Post, Body } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { UpdateOperationalCostConfigDto } from './dto/update-config.dto';
import { OperationalCostConfigResponseDto } from './dto/config-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('pricing-config')
@Controller('pricing/config')
export class PricingConfigController {
  constructor(private readonly pricingService: PricingService) {}

  @ApiOperation({ summary: 'Obtém a configuração atual de parâmetros financeiros e custos operacionais.' })
  @ApiResponse({ status: 200, description: 'Configuração retornada com sucesso.', type: OperationalCostConfigResponseDto })
  @Get()
  getConfig(): Promise<OperationalCostConfigResponseDto> {
    return this.pricingService.getConfig();
  }

  @ApiOperation({ summary: 'Atualiza a configuração de parâmetros financeiros e custos operacionais.' })
  @ApiResponse({ status: 200, description: 'Configuração atualizada com sucesso.', type: OperationalCostConfigResponseDto })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @Post()
  updateConfig(@Body() dto: UpdateOperationalCostConfigDto): Promise<OperationalCostConfigResponseDto> {
    return this.pricingService.updateConfig(dto);
  }
}

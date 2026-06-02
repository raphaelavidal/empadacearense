import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { PricingConfigController } from './pricing-config.controller';
import { PrismaModule } from '@database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PricingController, PricingConfigController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}

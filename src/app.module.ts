import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@modules/health/health.module';
import { PrismaModule } from '@database/prisma/prisma.module';
import { IngredientsModule } from './modules/ingredients/ingredients.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    PrismaModule,

    HealthModule,
    IngredientsModule
  ]
})
export class AppModule {}

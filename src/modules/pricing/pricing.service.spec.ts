import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { PrismaService } from '@database/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { UnitType } from '@prisma/client';

const mockPrismaService = {
  recipe: {
    findUnique: jest.fn(),
  },
  operationalCostConfig: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('PricingService', () => {
  let service: PricingService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
    prisma = module.get(PrismaService) as unknown as typeof mockPrismaService;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateRecipeBaseCost', () => {
    it('should successfully calculate the base proportional cost, labor, operational, production, profit, and suggested selling price', async () => {
      const mockRecipe = {
        id: 1,
        name: 'Empada Cearense Clássica',
        yield: 12,
        yieldUnit: UnitType.UNIT,
        prepTime: 45, // 45 minutos
        ingredients: [
          {
            quantity: 250.00,
            ingredient: {
              id: 10,
              name: 'Farinha de Trigo',
              unit: UnitType.G,
              purchasePrice: 15.00,
              purchaseQuantity: 1000.00,
            },
          },
          {
            quantity: 120.00,
            ingredient: {
              id: 11,
              name: 'Manteiga',
              unit: UnitType.G,
              purchasePrice: 14.50,
              purchaseQuantity: 500.00,
            },
          },
        ],
      };

      const mockConfig = {
        id: 1,
        hourlyRate: 20.00,
        profitMargin: 100.00,
        operationalTax: 15.00,
        packagingCost: 1.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.recipe.findUnique.mockResolvedValue(mockRecipe);
      prisma.operationalCostConfig.findFirst.mockResolvedValue(mockConfig);

      const result = await service.calculateRecipeBaseCost(1);

      // Custo Farinha: (15 / 1000) * 250 = R$ 3.75
      // Custo Manteiga: (14.5 / 500) * 120 = R$ 3.48
      // Total Base Cost (CMV): 3.75 + 3.48 = R$ 7.23
      // Unit Base Cost: 7.23 / 12 = R$ 0.60
      // Labor Cost: (45 / 60) * 20 = R$ 15.00
      // Operational Cost: 7.23 * 15% = R$ 1.08
      // Packaging Cost: R$ 1.00
      // Total Production Cost: 7.23 + 15.00 + 1.08 + 1.00 = R$ 24.31
      // Profit Amount: 24.31 * 100% = R$ 24.31
      // Suggested Price: 24.31 + 24.31 = R$ 48.62
      // Unit Suggested Price: 48.62 / 12 = R$ 4.05

      expect(prisma.recipe.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });

      expect(result).toEqual({
        recipeId: 1,
        recipeName: 'Empada Cearense Clássica',
        yield: 12,
        yieldUnit: UnitType.UNIT,
        totalBaseCost: 7.23,
        unitBaseCost: 0.60,
        laborCost: 15.00,
        operationalCost: 1.08,
        packagingCost: 1.00,
        totalProductionCost: 24.31,
        profitAmount: 24.31,
        suggestedPrice: 48.62,
        unitSuggestedPrice: 4.05,
        ingredients: [
          {
            ingredientId: 10,
            name: 'Farinha de Trigo',
            quantityUsed: 250,
            unit: UnitType.G,
            proportionalCost: 3.75,
          },
          {
            ingredientId: 11,
            name: 'Manteiga',
            quantityUsed: 120,
            unit: UnitType.G,
            proportionalCost: 3.48,
          },
        ],
      });
    });

    it('should return correct labor, production, suggested selling prices even if recipe has no ingredients', async () => {
      const mockRecipe = {
        id: 2,
        name: 'Empada de vento',
        yield: 10,
        yieldUnit: UnitType.UNIT,
        prepTime: 30, // 30 min
        ingredients: [],
      };

      const mockConfig = {
        id: 1,
        hourlyRate: 20.00,
        profitMargin: 100.00,
        operationalTax: 15.00,
        packagingCost: 1.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.recipe.findUnique.mockResolvedValue(mockRecipe);
      prisma.operationalCostConfig.findFirst.mockResolvedValue(mockConfig);

      const result = await service.calculateRecipeBaseCost(2);

      // CMV = 0
      // Unit CMV = 0
      // Labor Cost = (30 / 60) * 20 = 10.00
      // Operational Cost = 0
      // Packaging = 1.00
      // Total Production Cost = 10.00 + 1.00 = 11.00
      // Profit Amount = 11.00 * 100% = 11.00
      // Suggested Price = 11.00 + 11.00 = 22.00
      // Unit Suggested = 22.00 / 10 = 2.20

      expect(result).toEqual({
        recipeId: 2,
        recipeName: 'Empada de vento',
        yield: 10,
        yieldUnit: UnitType.UNIT,
        totalBaseCost: 0,
        unitBaseCost: 0,
        laborCost: 10.00,
        operationalCost: 0,
        packagingCost: 1.00,
        totalProductionCost: 11.00,
        profitAmount: 11.00,
        suggestedPrice: 22.00,
        unitSuggestedPrice: 2.20,
        ingredients: [],
      });
    });

    it('should throw a NotFoundException if the recipe does not exist', async () => {
      prisma.recipe.findUnique.mockResolvedValue(null);

      await expect(service.calculateRecipeBaseCost(999)).rejects.toThrow(
        new NotFoundException('Receita com ID 999 não encontrada.')
      );
    });

    it('should handle decimal rounding precision correctly', async () => {
      const mockRecipe = {
        id: 3,
        name: 'Empada de Chocolate',
        yield: 3,
        prepTime: 40,
        ingredients: [
          {
            quantity: 100.00,
            ingredient: {
              id: 20,
              name: 'Chocolate',
              unit: UnitType.G,
              purchasePrice: 10.00,
              purchaseQuantity: 100.00,
            },
          },
        ],
      };

      const mockConfig = {
        id: 1,
        hourlyRate: 20.00,
        profitMargin: 100.00,
        operationalTax: 15.00,
        packagingCost: 1.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.recipe.findUnique.mockResolvedValue(mockRecipe);
      prisma.operationalCostConfig.findFirst.mockResolvedValue(mockConfig);

      const result = await service.calculateRecipeBaseCost(3);

      // CMV = 10.00
      // Labor Cost = (40 / 60) * 20 = 13.33
      // Operational Cost = 10 * 15% = 1.50
      // Packaging = 1.00
      // Total Production = 10.00 + 13.33 + 1.50 + 1.00 = 25.83
      // Profit Amount = 25.83 * 100% = 25.83
      // Suggested Price = 25.83 + 25.83 = 51.66
      // Unit Suggested = 51.66 / 3 = 17.22

      expect(result.totalBaseCost).toBe(10.00);
      expect(result.laborCost).toBe(13.33);
      expect(result.operationalCost).toBe(1.50);
      expect(result.totalProductionCost).toBe(25.83);
      expect(result.suggestedPrice).toBe(51.66);
      expect(result.unitSuggestedPrice).toBe(17.22);
    });
  });

  describe('getConfig', () => {
    it('should return default config if none exists in database', async () => {
      prisma.operationalCostConfig.findFirst.mockResolvedValue(null);
      const mockCreated = {
        id: 1,
        hourlyRate: 20.00,
        profitMargin: 100.00,
        operationalTax: 15.00,
        packagingCost: 1.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.operationalCostConfig.create.mockResolvedValue(mockCreated);

      const result = await service.getConfig();

      expect(prisma.operationalCostConfig.findFirst).toHaveBeenCalled();
      expect(prisma.operationalCostConfig.create).toHaveBeenCalledWith({
        data: {
          hourlyRate: 20.00,
          profitMargin: 100.00,
          operationalTax: 15.00,
          packagingCost: 1.00,
        },
      });
      expect(result).toEqual({
        id: 1,
        hourlyRate: 20,
        profitMargin: 100,
        operationalTax: 15,
        packagingCost: 1,
        createdAt: mockCreated.createdAt,
        updatedAt: mockCreated.updatedAt,
      });
    });

    it('should return existing config if it exists', async () => {
      const mockConfig = {
        id: 1,
        hourlyRate: 25.00,
        profitMargin: 150.00,
        operationalTax: 10.00,
        packagingCost: 2.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.operationalCostConfig.findFirst.mockResolvedValue(mockConfig);

      const result = await service.getConfig();

      expect(prisma.operationalCostConfig.findFirst).toHaveBeenCalled();
      expect(prisma.operationalCostConfig.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        id: 1,
        hourlyRate: 25,
        profitMargin: 150,
        operationalTax: 10,
        packagingCost: 2,
        createdAt: mockConfig.createdAt,
        updatedAt: mockConfig.updatedAt,
      });
    });
  });

  describe('updateConfig', () => {
    it('should create new config if none exists', async () => {
      prisma.operationalCostConfig.findFirst.mockResolvedValue(null);
      const dto = {
        hourlyRate: 30.00,
        profitMargin: 120.00,
        operationalTax: 12.00,
        packagingCost: 1.80,
      };
      const mockCreated = { id: 1, ...dto, createdAt: new Date(), updatedAt: new Date() };
      prisma.operationalCostConfig.create.mockResolvedValue(mockCreated);

      const result = await service.updateConfig(dto);

      expect(prisma.operationalCostConfig.create).toHaveBeenCalledWith({ data: dto });
      expect(result.hourlyRate).toBe(30);
    });

    it('should update existing config if it exists', async () => {
      const existing = { id: 2, hourlyRate: 20.00 };
      prisma.operationalCostConfig.findFirst.mockResolvedValue(existing);
      const dto = {
        hourlyRate: 35.00,
        profitMargin: 110.00,
        operationalTax: 8.00,
        packagingCost: 0.90,
      };
      const mockUpdated = { id: 2, ...dto, createdAt: new Date(), updatedAt: new Date() };
      prisma.operationalCostConfig.update.mockResolvedValue(mockUpdated);

      const result = await service.updateConfig(dto);

      expect(prisma.operationalCostConfig.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: dto,
      });
      expect(result.hourlyRate).toBe(35);
    });
  });
});

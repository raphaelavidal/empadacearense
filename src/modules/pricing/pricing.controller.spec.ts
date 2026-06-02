import { Test, TestingModule } from '@nestjs/testing';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { UnitType } from '@prisma/client';

const mockPricingService = {
  calculateRecipeBaseCost: jest.fn(),
};

describe('PricingController', () => {
  let controller: PricingController;
  let service: typeof mockPricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricingController],
      providers: [
        {
          provide: PricingService,
          useValue: mockPricingService,
        },
      ],
    }).compile();

    controller = module.get<PricingController>(PricingController);
    service = module.get(PricingService) as unknown as typeof mockPricingService;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('calculateCost', () => {
    it('should successfully delegate cost calculation to service', async () => {
      const mockResult = {
        recipeId: 1,
        recipeName: 'Empada Cearense',
        yield: 10,
        yieldUnit: UnitType.UNIT,
        totalBaseCost: 15.00,
        unitBaseCost: 1.50,
        ingredients: [],
      };

      service.calculateRecipeBaseCost.mockResolvedValue(mockResult);

      const result = await controller.calculateCost(1);

      expect(service.calculateRecipeBaseCost).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });
});

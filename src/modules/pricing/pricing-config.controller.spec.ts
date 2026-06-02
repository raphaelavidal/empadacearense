import { Test, TestingModule } from '@nestjs/testing';
import { PricingConfigController } from './pricing-config.controller';
import { PricingService } from './pricing.service';

const mockPricingService = {
  getConfig: jest.fn(),
  updateConfig: jest.fn(),
};

describe('PricingConfigController', () => {
  let controller: PricingConfigController;
  let service: typeof mockPricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricingConfigController],
      providers: [
        {
          provide: PricingService,
          useValue: mockPricingService,
        },
      ],
    }).compile();

    controller = module.get<PricingConfigController>(PricingConfigController);
    service = module.get(PricingService) as unknown as typeof mockPricingService;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getConfig', () => {
    it('should delegate getConfig to service', async () => {
      const mockResult = {
        id: 1,
        hourlyRate: 20,
        profitMargin: 100,
        operationalTax: 15,
        packagingCost: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.getConfig.mockResolvedValue(mockResult);

      const result = await controller.getConfig();

      expect(service.getConfig).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateConfig', () => {
    it('should delegate updateConfig to service with payload', async () => {
      const dto = {
        hourlyRate: 25.50,
        profitMargin: 120,
        operationalTax: 10,
        packagingCost: 1.50,
      };
      const mockResult = {
        id: 1,
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.updateConfig.mockResolvedValue(mockResult);

      const result = await controller.updateConfig(dto);

      expect(service.updateConfig).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });
});

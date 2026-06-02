import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';
import { NovaClassification, UnitType } from '@prisma/client';

const mockIngredientsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('IngredientsController', () => {
  let controller: IngredientsController;
  let service: typeof mockIngredientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientsController],
      providers: [
        {
          provide: IngredientsService,
          useValue: mockIngredientsService,
        },
      ],
    }).compile();

    controller = module.get<IngredientsController>(IngredientsController);
    service = module.get(IngredientsService) as unknown as typeof mockIngredientsService;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully delegate creating an ingredient to service', async () => {
      const dto = {
        name: 'Açúcar Demerara',
        brand: 'Doce Vida',
        unit: UnitType.KG,
        novaClassification: NovaClassification.NOVA_2,
        compositionLabel: 'Açúcar demerara orgânico',
        purchasePrice: 9.8,
        purchaseQuantity: 1,
      };

      const mockResult = { id: 2, ...dto, createdAt: new Date(), updatedAt: new Date() };
      service.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should successfully delegate paginated search query to service', async () => {
      const query = { page: 1, limit: 10, search: 'açúcar' };
      const mockResult = {
        items: [{ id: 2, name: 'Açúcar Demerara' }],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      service.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should successfully delegate getting single ingredient by id to service', async () => {
      const mockResult = { id: 2, name: 'Açúcar Demerara' };
      service.findOne.mockResolvedValue(mockResult);

      const result = await controller.findOne('2');
      expect(service.findOne).toHaveBeenCalledWith(2);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should successfully delegate deleting an ingredient to service', async () => {
      const mockResult = { id: 2, name: 'Açúcar Demerara' };
      service.remove.mockResolvedValue(mockResult);

      const result = await controller.remove('2');
      expect(service.remove).toHaveBeenCalledWith(2);
      expect(result).toEqual(mockResult);
    });
  });
});

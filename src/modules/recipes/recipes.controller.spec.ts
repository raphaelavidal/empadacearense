import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { UnitType } from '@prisma/client';

const mockRecipesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('RecipesController', () => {
  let controller: RecipesController;
  let service: typeof mockRecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: mockRecipesService,
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    service = module.get(RecipesService) as unknown as typeof mockRecipesService;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully delegate creating a recipe to service', async () => {
      const dto = {
        name: 'Empada Doce',
        description: 'Empada cearense de chocolate',
        yield: 15,
        yieldUnit: UnitType.UNIT,
        prepTime: 30,
        category: 'Doces',
        prepMethod: 'Passo 1. Abra a massa...',
        ingredients: [
          { ingredientId: 4, quantity: 150 },
        ],
        steps: [
          { order: 1, description: 'Passo 1. Abra a massa...' }
        ],
      };

      const mockResult = { id: 2, ...dto, createdAt: new Date(), updatedAt: new Date() };
      service.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should delegate finding all recipes to service with query params', async () => {
      const query = { page: 1, limit: 5, category: 'Doces' };
      const mockResult = {
        items: [],
        meta: { total: 0, page: 1, limit: 5, totalPages: 0 },
      };
      service.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should delegate finding a single recipe to service', async () => {
      const mockResult = {
        id: 1,
        name: 'Empada de Frango',
        yield: 10,
        yieldUnit: UnitType.UNIT,
        prepTime: 45,
        category: 'Salgados',
        ingredients: [],
        steps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      service.findOne.mockResolvedValue(mockResult);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });
});

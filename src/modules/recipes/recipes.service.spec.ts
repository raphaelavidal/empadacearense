import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from './recipes.service';
import { PrismaService } from '@database/prisma/prisma.service';
import { UnitType, NovaClassification } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  recipe: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
  },
  ingredient: {
    findMany: jest.fn(),
  },
};

describe('RecipesService', () => {
  let service: RecipesService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    prisma = module.get(PrismaService) as unknown as typeof mockPrismaService;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a recipe with steps and map it to RecipeResponseDto if all ingredients exist', async () => {
      const dto = {
        name: 'Empada de Frango',
        description: 'Deliciosa empada cearense',
        yield: 10,
        yieldUnit: UnitType.UNIT,
        prepTime: 40,
        category: 'Salgados',
        prepMethod: 'Passo 1...',
        ingredients: [
          { ingredientId: 1, quantity: 200 },
          { ingredientId: 2, quantity: 100 },
        ],
        steps: [
          { order: 1, description: 'Misture a farinha' },
          { order: 2, description: 'Asse no forno' },
        ],
      };

      prisma.ingredient.findMany.mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);

      const mockDbResult = {
        id: 1,
        name: dto.name,
        description: dto.description,
        yield: dto.yield,
        yieldUnit: dto.yieldUnit,
        prepTime: dto.prepTime,
        category: dto.category,
        prepMethod: dto.prepMethod,
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: [
          {
            id: 1,
            recipeId: 1,
            ingredientId: 1,
            quantity: 200,
            ingredient: {
              id: 1,
              name: 'Farinha de Trigo',
              brand: 'Dona Benta',
              unit: UnitType.KG,
              novaClassification: NovaClassification.NOVA_1,
              compositionLabel: 'Farinha de trigo pura.',
              isNovaVerified: true,
            },
          },
          {
            id: 2,
            recipeId: 1,
            ingredientId: 2,
            quantity: 100,
            ingredient: {
              id: 2,
              name: 'Manteiga',
              brand: 'Aviação',
              unit: UnitType.KG,
              novaClassification: NovaClassification.NOVA_2,
              compositionLabel: 'Creme de leite, sal.',
              isNovaVerified: false,
            },
          },
        ],
        steps: [
          { id: 1, recipeId: 1, order: 1, description: 'Misture a farinha' },
          { id: 2, recipeId: 1, order: 2, description: 'Asse no forno' },
        ],
      };

      prisma.recipe.create.mockResolvedValue(mockDbResult);

      const result = await service.create(dto);

      expect(prisma.ingredient.findMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2] } },
        select: { id: true },
      });

      expect(prisma.recipe.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          description: dto.description,
          yield: dto.yield,
          yieldUnit: dto.yieldUnit,
          prepTime: dto.prepTime,
          category: dto.category,
          prepMethod: dto.prepMethod,
          ingredients: {
            create: [
              { ingredientId: 1, quantity: 200 },
              { ingredientId: 2, quantity: 100 },
            ],
          },
          steps: {
            create: [
              { order: 1, description: 'Misture a farinha' },
              { order: 2, description: 'Asse no forno' },
            ],
          },
        },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
          steps: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      expect(result).toEqual({
        id: 1,
        name: dto.name,
        description: dto.description,
        yield: 10,
        yieldUnit: dto.yieldUnit,
        prepTime: dto.prepTime,
        category: dto.category,
        prepMethod: dto.prepMethod,
        classification: 'Natural',
        createdAt: mockDbResult.createdAt,
        updatedAt: mockDbResult.updatedAt,
        ingredients: [
          {
            id: 1,
            name: 'Farinha de Trigo',
            brand: 'Dona Benta',
            unit: UnitType.KG,
            novaClassification: NovaClassification.NOVA_1,
            compositionLabel: 'Farinha de trigo pura.',
            isNovaVerified: true,
            quantity: 200,
          },
          {
            id: 2,
            name: 'Manteiga',
            brand: 'Aviação',
            unit: UnitType.KG,
            novaClassification: NovaClassification.NOVA_2,
            compositionLabel: 'Creme de leite, sal.',
            isNovaVerified: false,
            quantity: 100,
          },
        ],
        steps: [
          { id: 1, order: 1, description: 'Misture a farinha' },
          { id: 2, order: 2, description: 'Asse no forno' },
        ],
      });
    });

    it('should throw a BadRequestException if any ingredient does not exist in the database', async () => {
      const dto = {
        name: 'Empada de Frango',
        yield: 10,
        yieldUnit: UnitType.UNIT,
        prepTime: 40,
        category: 'Salgados',
        prepMethod: 'Misture tudo',
        ingredients: [
          { ingredientId: 1, quantity: 200 },
          { ingredientId: 99, quantity: 100 },
        ],
        steps: [
          { order: 1, description: 'Misture tudo' },
        ],
      };

      prisma.ingredient.findMany.mockResolvedValue([
        { id: 1 },
      ]);

      await expect(service.create(dto)).rejects.toThrow(
        new BadRequestException(
          'Cadastro bloqueado: Os seguintes ingredientes não foram encontrados no banco de dados: [99].'
        )
      );

      expect(prisma.recipe.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated recipes and metadata with category filter', async () => {
      const mockRecipes = [
        {
          id: 1,
          name: 'Empada de Palmito',
          description: 'Vegetariana',
          yield: 8,
          yieldUnit: UnitType.UNIT,
          prepTime: 35,
          category: 'Salgados',
          prepMethod: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          ingredients: [],
          steps: [],
        },
      ];

      prisma.recipe.findMany.mockResolvedValue(mockRecipes);
      prisma.recipe.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10, category: 'Salgados' });

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: {
          category: {
            equals: 'Salgados',
            mode: 'insensitive',
          },
        },
        skip: 0,
        take: 10,
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
          steps: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(result).toEqual({
        items: [
          {
            id: 1,
            name: 'Empada de Palmito',
            description: 'Vegetariana',
            yield: 8,
            yieldUnit: UnitType.UNIT,
            prepTime: 35,
            category: 'Salgados',
            prepMethod: undefined,
            classification: 'Natural',
            createdAt: mockRecipes[0].createdAt,
            updatedAt: mockRecipes[0].updatedAt,
            ingredients: [],
            steps: [],
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return the recipe detailed with ingredients and steps ordered by order ASC', async () => {
      const mockRecipe = {
        id: 1,
        name: 'Empada Cearense',
        description: 'Saborosa',
        yield: 12,
        yieldUnit: UnitType.UNIT,
        prepTime: 50,
        category: 'Salgados',
        prepMethod: 'Método...',
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: [
          {
            id: 1,
            quantity: 300,
            ingredient: {
              id: 10,
              name: 'Farinha',
              brand: 'A',
              unit: UnitType.KG,
              novaClassification: NovaClassification.NOVA_1,
              compositionLabel: 'Composição de farinha.',
              isNovaVerified: true,
            },
          },
        ],
        steps: [
          { id: 1, order: 1, description: 'Misture' },
          { id: 2, order: 2, description: 'Asse' },
        ],
      };

      prisma.recipe.findUnique.mockResolvedValue(mockRecipe);

      const result = await service.findOne(1);

      expect(prisma.recipe.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
          steps: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      expect(result).toEqual({
        id: 1,
        name: 'Empada Cearense',
        description: 'Saborosa',
        yield: 12,
        yieldUnit: UnitType.UNIT,
        prepTime: 50,
        category: 'Salgados',
        prepMethod: 'Método...',
        classification: 'Natural',
        createdAt: mockRecipe.createdAt,
        updatedAt: mockRecipe.updatedAt,
        ingredients: [
          {
            id: 10,
            name: 'Farinha',
            brand: 'A',
            unit: UnitType.KG,
            novaClassification: NovaClassification.NOVA_1,
            compositionLabel: 'Composição de farinha.',
            isNovaVerified: true,
            quantity: 300,
          },
        ],
        steps: [
          { id: 1, order: 1, description: 'Misture' },
          { id: 2, order: 2, description: 'Asse' },
        ],
      });
    });

    it('should throw a NotFoundException if recipe with given ID does not exist', async () => {
      prisma.recipe.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Receita com ID 999 não encontrada.')
      );
    });
  });

  describe('Automatic NOVA Classification Logic', () => {
    const baseRecipeMock = {
      id: 5,
      name: 'Empada Especial',
      yield: 5,
      yieldUnit: UnitType.UNIT,
      prepTime: 30,
      category: 'Salgados',
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [],
    };

    it('should classify as Natural if recipe contains only NOVA_1 or NOVA_2 ingredients', async () => {
      const mockDbRecipe = {
        ...baseRecipeMock,
        ingredients: [
          {
            id: 1,
            quantity: 100,
            ingredient: {
              id: 1,
              name: 'Ingrediente 1',
              unit: UnitType.G,
              novaClassification: NovaClassification.NOVA_1,
              compositionLabel: 'Natural raw material',
              isNovaVerified: true,
            },
          },
          {
            id: 2,
            quantity: 50,
            ingredient: {
              id: 2,
              name: 'Ingrediente 2',
              unit: UnitType.G,
              novaClassification: NovaClassification.NOVA_2,
              compositionLabel: 'Salt/Sugar',
              isNovaVerified: true,
            },
          },
        ],
      };

      prisma.recipe.findUnique.mockResolvedValue(mockDbRecipe);
      const result = await service.findOne(5);
      expect(result.classification).toBe('Natural');
    });

    it('should classify as Processada if recipe contains at least one NOVA_3 ingredient and no NOVA_4', async () => {
      const mockDbRecipe = {
        ...baseRecipeMock,
        ingredients: [
          {
            id: 1,
            quantity: 100,
            ingredient: {
              id: 1,
              name: 'Ingrediente 1',
              unit: UnitType.G,
              novaClassification: NovaClassification.NOVA_1,
              compositionLabel: 'Natural raw',
              isNovaVerified: true,
            },
          },
          {
            id: 3,
            quantity: 50,
            ingredient: {
              id: 3,
              name: 'Queijo Processado',
              unit: UnitType.G,
              novaClassification: NovaClassification.NOVA_3,
              compositionLabel: 'Queijo tradicional curado.',
              isNovaVerified: true,
            },
          },
        ],
      };

      prisma.recipe.findUnique.mockResolvedValue(mockDbRecipe);
      const result = await service.findOne(5);
      expect(result.classification).toBe('Processada');
    });

    it('should classify as Contém ultraprocessados if recipe contains at least one NOVA_4 ingredient, regardless of others', async () => {
      const mockDbRecipe = {
        ...baseRecipeMock,
        ingredients: [
          {
            id: 1,
            quantity: 100,
            ingredient: {
              id: 1,
              name: 'Ingrediente 1',
              unit: UnitType.G,
              novaClassification: NovaClassification.NOVA_1,
              compositionLabel: 'Natural',
              isNovaVerified: true,
            },
          },
          {
            id: 3,
            quantity: 50,
            ingredient: {
              id: 3,
              name: 'Queijo',
              unit: UnitType.G,
              novaClassification: NovaClassification.NOVA_3,
              compositionLabel: 'Queijo',
              isNovaVerified: true,
            },
          },
          {
            id: 4,
            quantity: 5,
            ingredient: {
              id: 4,
              name: 'Corante Artificial',
              unit: UnitType.ML,
              novaClassification: NovaClassification.NOVA_4,
              compositionLabel: 'Corante tartrazina, estabilizante.',
              isNovaVerified: false,
            },
          },
        ],
      };

      prisma.recipe.findUnique.mockResolvedValue(mockDbRecipe);
      const result = await service.findOne(5);
      expect(result.classification).toBe('Contém ultraprocessados');
    });

    it('should classify as Natural if recipe has no ingredients', async () => {
      const mockDbRecipe = {
        ...baseRecipeMock,
        ingredients: [],
      };

      prisma.recipe.findUnique.mockResolvedValue(mockDbRecipe);
      const result = await service.findOne(5);
      expect(result.classification).toBe('Natural');
    });
  });
});

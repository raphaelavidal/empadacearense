import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsService } from './ingredients.service';
import { PrismaService } from '@database/prisma/prisma.service';
import { NovaClassification, UnitType, Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  ingredient: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

describe('IngredientsService', () => {
  let service: IngredientsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<IngredientsService>(IngredientsService);
    prisma = module.get(PrismaService) as unknown as typeof mockPrismaService;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an ingredient', async () => {
      const dto = {
        name: 'Farinha de Aveia',
        brand: 'Natural Sabor',
        unit: UnitType.KG,
        novaClassification: NovaClassification.NOVA_1,
        compositionLabel: 'Farinha de aveia integral',
        purchasePrice: 15.5,
        purchaseQuantity: 1,
      };

      const mockResult = { id: 1, ...dto, createdAt: new Date(), updatedAt: new Date() };
      prisma.ingredient.create.mockResolvedValue(mockResult);

      const result = await service.create(dto);
      expect(prisma.ingredient.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of ingredients without search filter', async () => {
      const items = [{ id: 1, name: 'Farinha de Aveia' }];
      prisma.ingredient.findMany.mockResolvedValue(items);
      prisma.ingredient.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(prisma.ingredient.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.ingredient.count).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual({
        items,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should return a paginated list with case-insensitive name search filter', async () => {
      const items = [{ id: 1, name: 'Farinha de Aveia' }];
      prisma.ingredient.findMany.mockResolvedValue(items);
      prisma.ingredient.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 2, limit: 5, search: 'farinha' });
      expect(prisma.ingredient.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: 'farinha',
            mode: 'insensitive',
          },
        },
        skip: 5,
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.ingredient.count).toHaveBeenCalledWith({
        where: {
          name: {
            contains: 'farinha',
            mode: 'insensitive',
          },
        },
      });
      expect(result).toEqual({
        items,
        meta: {
          total: 1,
          page: 2,
          limit: 5,
          totalPages: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single ingredient by id', async () => {
      const mockResult = { id: 1, name: 'Sal' };
      prisma.ingredient.findUnique.mockResolvedValue(mockResult);

      const result = await service.findOne(1);
      expect(prisma.ingredient.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockResult);
    });

    it('should throw a NotFoundException if ingredient does not exist', async () => {
      prisma.ingredient.findUnique.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(
        new NotFoundException('Ingrediente com ID 99 não encontrado.')
      );
    });
  });

  describe('remove', () => {
    it('should delete an ingredient by id', async () => {
      const mockResult = { id: 1, name: 'Açúcar' };
      prisma.ingredient.delete.mockResolvedValue(mockResult);

      const result = await service.remove(1);
      expect(prisma.ingredient.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockResult);
    });

    it('should throw a NotFoundException if ingredient does not exist for deletion', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: 'x.x.x',
      });
      prisma.ingredient.delete.mockRejectedValue(prismaError);

      await expect(service.remove(99)).rejects.toThrow(
        new NotFoundException('Ingrediente com ID 99 não encontrado para exclusão.')
      );
    });
  });
});

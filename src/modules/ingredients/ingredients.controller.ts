import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { FindIngredientsQueryDto } from './dto/find-ingredients-query.dto';
import { IngredientResponseDto } from './dto/ingredient-response.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @ApiOperation({ summary: 'Cadastra um novo ingrediente.' })
  @ApiResponse({ status: 201, description: 'Ingrediente cadastrado com sucesso.', type: IngredientResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto): Promise<IngredientResponseDto> {
    return this.ingredientsService.create(createIngredientDto) as any;
  }

  @ApiOperation({ summary: 'Lista os ingredientes com paginação e busca.' })
  @ApiResponse({ status: 200, description: 'Lista de ingredientes retornada com sucesso.' })
  @Get()
  findAll(@Query() query: FindIngredientsQueryDto) {
    return this.ingredientsService.findAll(query);
  }

  @ApiOperation({ summary: 'Lista o ingrediente cujo id foi passado na URL.' })
  @ApiResponse({ status: 200, description: 'Ingrediente encontrado com sucesso.', type: IngredientResponseDto })
  @ApiResponse({ status: 404, description: 'Ingrediente não encontrado.' })
  @ApiParam({ name: 'id', description: 'ID do ingrediente', type: Number })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<IngredientResponseDto> {
    return this.ingredientsService.findOne(+id) as any;
  }

  @ApiOperation({ summary: 'Deleta o ingrediente cujo id foi passado na URL.' })
  @ApiResponse({ status: 200, description: 'Ingrediente deletado com sucesso.', type: IngredientResponseDto })
  @ApiResponse({ status: 404, description: 'Ingrediente não encontrado.' })
  @ApiParam({ name: 'id', description: 'ID do ingrediente', type: Number })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IngredientResponseDto> {
    return this.ingredientsService.remove(+id) as any;
  }
}

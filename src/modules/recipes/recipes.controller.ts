import { Controller, Post, Body, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeResponseDto } from './dto/recipe-response.dto';
import { FindRecipesQueryDto } from './dto/find-recipes-query.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiOperation({ summary: 'Cadastra uma nova receita com seus ingredientes e passos estruturados.' })
  @ApiResponse({ status: 201, description: 'Receita cadastrada com sucesso.', type: RecipeResponseDto })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto): Promise<RecipeResponseDto> {
    return this.recipesService.create(createRecipeDto);
  }

  @ApiOperation({ summary: 'Lista todas as receitas cadastradas de forma paginada e com filtros opcionais.' })
  @ApiResponse({ status: 200, description: 'Lista de receitas retornada com sucesso.' })
  @Get()
  findAll(@Query() query: FindRecipesQueryDto) {
    return this.recipesService.findAll(query);
  }

  @ApiOperation({ summary: 'Busca os detalhes de uma receita específica pelo seu ID (incluindo ingredientes e passos).' })
  @ApiResponse({ status: 200, description: 'Receita encontrada.', type: RecipeResponseDto })
  @ApiResponse({ status: 404, description: 'Receita não encontrada.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RecipeResponseDto> {
    return this.recipesService.findOne(id);
  }
}

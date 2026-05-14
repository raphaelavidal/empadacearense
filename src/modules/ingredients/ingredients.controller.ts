import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @ApiOperation({ summary: 'Cadastra um novo ingrediente.' })
  @ApiResponse({ status: 201, description: 'Ingrediente cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @ApiOperation({ summary: 'Lista todos os ingredientes cadastrados.' })
  @Get()
  findAll() {
    return this.ingredientsService.findAll();
  }

  @ApiOperation({ summary: 'Lista o ingrediente cujo id foi passado na URL.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Deleta o ingrediente cujo id foi passado na URL.' })
  @ApiResponse({ status: 200, description: 'Ingrediente deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Ingrediente não encontrado.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(+id);
  }
}

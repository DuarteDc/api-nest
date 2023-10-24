import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Request } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get('disable')
  findAllTrashed() {
    return this.productsService.getAllTrashedProducts();
  }
  @Get('searched')
  findByCookies(@Req() request: Request) {
    console.log(request.cookies);
    return request.cookies
  }
  
  @Get(':query')
  findOne(@Param('query') query: string) {
    return this.productsService.findOne(query);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

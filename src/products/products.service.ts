import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PaginateModel, isValidObjectId } from 'mongoose';

import { Product } from './schemas/product.schema';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
@Injectable()
export class ProductsService {

  constructor(@InjectModel(Product.name) private readonly productModel: PaginateModel<Product>) { }

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.productModel.create(createProductDto);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const options = JSON.parse(JSON.stringify(paginationDto));
      return await this.productModel.paginate({ status: true }, options)
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(query: string) {
    try {
      let product: Product;
      if (isValidObjectId(query))
        product = await this.productModel.findById(query);
      else
        product = await this.productModel.findOne({ slug: query });

      if (!product) throw new NotFoundException(`${query} not found`)

      return product;

    } catch (error) {
      this.handleError(error);
    }
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
  }

  async remove(id: string) {
    try {
      return await this.update(id, { status: false });
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: any) {
    if (error.code === 11000) throw new BadRequestException(`Pokemon with ${JSON.stringify(error.keyValue)} has already exist`);

    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException('Check server logs')
  }
}

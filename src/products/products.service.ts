import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PaginateModel, isValidObjectId } from 'mongoose';

import { Product } from './schemas/product.schema';

import { CreateProductDto, UpdateProductDto } from './dto/';
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
      return await this.productModel.find({ status: true }, options)
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      await this.findOne(id);
      return await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
    } catch (error) {
      this.handleError(error)
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.update(id, { status: false });
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAllTrashedProducts() {
    try {
      return await this.productModel.paginate({ status: false });
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.code === 11000) throw new BadRequestException(`Product with ${JSON.stringify(error.keyValue)} has already exist`);

    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException('Check server logs')
  }
}

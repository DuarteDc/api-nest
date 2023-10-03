import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PaginateModel } from 'mongoose';

import { Product } from './schemas/product.schema';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {

  constructor(@InjectModel(Product.name) private readonly productModel: PaginateModel<Product>) { }

  async create(createProductDto: CreateProductDto) {
    return await this.productModel.create(createProductDto)
  }

  findAll() {
    return this.productModel.paginate({})
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}

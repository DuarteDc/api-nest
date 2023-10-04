import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { Category } from './schemas/category.schema';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CategoriesService {

  constructor(@InjectModel(Category.name) private readonly categoryModel: PaginateModel<Category>) { }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoryModel.create(createCategoryDto);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const options = JSON.parse(JSON.stringify(paginationDto));
      return await this.categoryModel.paginate({}, options);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id, { status : true });
    if ( !category || !category.status ) throw new NotFoundException('Category not found')
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.findOne(id);
      return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
    } catch (error) {
      this.handleError(error);
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

  private handleError(error: any) {
    if (error.code === 11000) throw new BadRequestException(`Product with ${JSON.stringify(error.keyValue)} has already exist`);

    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException('Check server logs')
  }

}

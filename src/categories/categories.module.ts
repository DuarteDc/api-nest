import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [ CategoriesController ],
  providers: [ CategoriesService ],
  imports: [ 
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      }
    ])
  ],
  exports: [ CategoriesService ]
})

export class CategoriesModule {}

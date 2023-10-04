import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaModel } from 'mongoose';

import * as mongoosePaginate from 'mongoose-paginate-v2';

import { Category } from 'src/categories/schemas/category.schema';

export type ProductDocument = HydratedDocument<Product>

@Schema({ timestamps: true })
export class Product {

    readonly _id: String;

    @Prop({
        type: String,
        required: true,
    })
    name: String;

    @Prop({
        type: String,
        required: false,
        unique: true,
    })
    slug: String;

    @Prop({
        type: Number,
        required: true,
    })
    price: Number;

    @Prop({
        type: Number,
        required: true,
        default: 0
    })
    stock: Number;

    @Prop({
        type: [{ type: SchemaModel.Types.ObjectId, ref: 'categories' }],
        required: true,
        default: []
    })
    tags: Array<Category>

    @Prop({
        type: Boolean,
        default: true,
    })
    status: Boolean;

}


export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema
    .plugin(mongoosePaginate);
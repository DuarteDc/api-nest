import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

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
        type: Boolean,
        default: true,
     })
     status: Boolean;

}


export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema
    .plugin(mongoosePaginate);
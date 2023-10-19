import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Schema as SchemaModel } from 'mongoose';

import { ProductCart } from '../interfaces/product-cart.interface';

@Schema({ timestamps: true })
export class Cart {

    @Prop({
        type: SchemaModel.Types.ObjectId, ref: 'user',
        unique: true,
        required: true,
    })
    user_id: string;

    @Prop(raw({
        product_id: { type: SchemaModel.Types.ObjectId, ref: 'product' },
        quantity: { type: Number }
    }))
    products: Array<ProductCart>;

}

export const CartSchema = SchemaFactory.createForClass(Cart);

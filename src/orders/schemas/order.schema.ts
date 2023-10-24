import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import * as mongoosePaginate from 'mongoose-paginate-v2';

import { OrderProduct } from '../interfaces/order-product.interface';


export type OrderDocument = HydratedDocument<Order>

@Schema({ timestamps: true })
export class Order {

    @Prop({
        type: String,
        required: true,
    })
    user_id: string;

    @Prop({
        type: Object,
        default: []
    })
    address: object;

    @Prop({
        type: Array,
        required: true,
    })
    products: Array<OrderProduct>

    @Prop({
        type: Number,
        required: true,
    })
    subtotal: number;

    @Prop({
        type: Number,
        required: false,
        default: 0,
    })
    discount: number;

    @Prop({
        type: Number,
        required: true,
    })
    total: number;

}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema
    .plugin(mongoosePaginate);

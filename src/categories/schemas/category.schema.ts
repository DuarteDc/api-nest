import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Category>

@Schema({ timestamps: true })
export class Category {

    readonly _id: string;

    @Prop({
        type: String,
        unique: true,
        required: true,
    })
    name: string;

    @Prop({
        type: String,
        unique: true,
        required: false,
    })
    slug: string;

    @Prop({
        type: Boolean,
        default: true,
    })
    status: boolean;

}

export const CategorySchema = SchemaFactory.createForClass( Category );
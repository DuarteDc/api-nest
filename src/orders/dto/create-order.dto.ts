import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, IsOptional, IsPositive, IsString, MinLength, ValidateNested } from 'class-validator';
import { CreateProductDto } from 'src/products/dto';

export abstract class OrderProduct extends CreateProductDto {

    @IsString()
    @IsMongoId()
    _id: string;

    @IsNumber()
    @IsPositive()
    quantity: number;
}

export class CreateOrderDto {

    @IsMongoId()
    @IsString()
    user_id: string;

    address: object;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderProduct)
    products: Array<OrderProduct>

    @IsNumber()
    @IsPositive()
    subtotal: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    discount: number;

    @IsNumber()
    @IsPositive()
    total: number;
}

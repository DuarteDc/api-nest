import { IsMongoId, IsNumber, IsPositive, IsString } from 'class-validator';

export class AddProductToCartDto {

    @IsString()
    @IsMongoId()
    product_id: string;

    @IsPositive()
    @IsNumber()
    quantity: number;

}
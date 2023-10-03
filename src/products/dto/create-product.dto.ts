import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateProductDto {

    @IsString()
    @MinLength(2)
    name: string;

    slug?: string;

    @IsNumber()
    price: Number;

    @IsNumber()
    stock: Number;

}

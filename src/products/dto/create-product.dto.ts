import { IsBoolean, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProductDto {

    @IsString()
    @MinLength(2)
    name: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsNumber()
    price: Number;

    @IsNumber()
    stock: Number;

    @IsOptional()
    @IsBoolean()
    status: Boolean;

}

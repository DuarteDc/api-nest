import { IsArray, IsMongoId, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

abstract class ProductCart {
    @IsMongoId()
    @IsString()
    product_id: string;

    @IsPositive()
    quantity: number;
}

export class CreateCartDto {

    @IsString()
    @IsMongoId()
    user_id: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductCart)
    products:  Array<ProductCart>

}

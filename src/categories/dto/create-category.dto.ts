import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {

    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @MinLength(2)
    @IsOptional()
    slug: string;

    @IsOptional()
    status?: boolean;

}

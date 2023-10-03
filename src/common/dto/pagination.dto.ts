import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {


    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    page?: Number;

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: Number;

}
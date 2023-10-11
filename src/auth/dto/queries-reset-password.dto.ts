import { IsMongoId, IsString } from "class-validator";

export class QueriesResetPasswordDto {

    @IsMongoId()
    @IsString()
    user_id: string;

    @IsString()
    token: string;
}
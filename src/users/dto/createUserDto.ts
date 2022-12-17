import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class CreateUserDto {

    @MaxLength(100)
    @IsNotEmpty()
    @ApiProperty()
    username: string;
    
    @MaxLength(100)
    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;
}
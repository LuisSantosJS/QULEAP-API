import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginInputDTO {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'Inserir o email', nullable: false, name: 'email', type: () => String })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Inserir a senha', nullable: false, name: 'password', type: () => String })
    password: string;
}

export class LoginOutpuDTO {
    
    @ApiProperty({  nullable: false, name: 'token', type: () => String })
    token: string;

    @ApiProperty({  nullable: false, name: 'roles', type: () => [String] })
    roles: string[];
}
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PlanInputDTO, PlanOutputDTO } from "src/services/plan/dto/plan.dto";


export class UserInputDTO {


    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ nullable: false, name: 'email', type: () => String })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ nullable: false, name: 'password', type: () => String })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ nullable: false, name: 'planId', type: () => String })
    planId: string;

}

export class UserInputUpdateDTO {
    @ApiProperty({ nullable: true, name: 'planId', type: () => String, required: false })
    planId: string;

    @ApiProperty({ nullable: true, name: 'password', type: () => String , required: false })
    password: string;
}

export class UserOutputDTO {
    @IsString()
    @IsNotEmpty()
    @Expose()
    @ApiProperty({ nullable: false, name: 'id', type: () => String })
    id: string;

    @IsEmail()
    @IsNotEmpty()
    @Expose()
    @ApiProperty({ nullable: false, name: 'email', type: () => String })
    email: string;


    @ApiProperty({ nullable: true, name: 'planId', type: () => String, required: false })
    @Expose()
    planId: string;

    @ApiProperty({ nullable: false, name: 'plan', type: () => PlanOutputDTO, required: false })
    @Expose()
    plan: PlanOutputDTO;

}
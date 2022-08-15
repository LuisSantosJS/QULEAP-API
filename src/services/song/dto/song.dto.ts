import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";


export class SongInputDTO {
    @IsString()
    @IsNotEmpty()
    @Expose()
    @ApiProperty({ nullable: false, name: 'name', type: () => String })
    name: string;


    @IsNotEmpty()
    @Expose()
    @ApiProperty({ nullable: false, name: 'plans', type: () => [String] })
    @MinLength(1)
    plans: string[];
}

export class SongOutputDTO  {
    @IsString()
    @IsNotEmpty()
    @Expose()
    @ApiProperty({ nullable: false, name: 'id', type: () => String })
    id: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    @ApiProperty({ nullable: false, name: 'name', type: () => String })
    name: string;


}

export class SongInputUpdateDTO {
    @IsNotEmpty()
    @Expose()
    @ApiProperty({ nullable: false, name: 'plans', type: () => [String] })
    plans: string[];
}


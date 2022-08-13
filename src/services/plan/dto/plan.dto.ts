import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";


export class PlanInputDTO {
    @IsString()
    @IsNotEmpty()
    @Expose()
    @ApiProperty({ nullable: false, name: 'title', type: () => String })
    title: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    @ApiProperty({ nullable: false, name: 'description', type: () => String })
    description: string;


    @IsInt()
    @IsNotEmpty()
    @Expose()
    @ApiProperty({ nullable: false, name: 'maxSong', type: () => Number })
    maxSong: number;
}

export class PlanOutputDTO extends PlanInputDTO {
    @IsString()
    @IsNotEmpty()
    @Expose()
    @ApiProperty({ nullable: false, name: 'id', type: () => String })
    id: string;

}

export class PlanInputUpdateDTO {
    @ApiProperty({ nullable: true, name: 'maxSong', type: () => Number, required: false })
    maxSong: number;

    @ApiProperty({ nullable: true, name: 'title', type: () => String, required: false })
    title: string;
}


import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard, JwtAuthGuardAdmin } from 'src/services/auth/guard/jwt-auth.guard';
import { SongInputDTO, SongInputUpdateDTO, SongOutputDTO } from 'src/services/song/dto/song.dto';
import { SongService } from 'src/services/song/song.service';



@Controller('song')
@ApiTags('Song')
@ApiBearerAuth()
export class SongController {
    constructor(private songService: SongService) { }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Listar músicas' })
    @ApiResponse({ status: 200, type: [SongOutputDTO], description: 'Retorna a lista de músicas' })
    @Get('/all')
    async all(@Req() req) {
        const songs = await this.songService.listSongs(req.user.id);
        return plainToInstance(SongOutputDTO, songs, { excludeExtraneousValues: true });
    }

    @UseGuards(JwtAuthGuardAdmin)
    @ApiOperation({ summary: 'Criar música' })
    @ApiResponse({ status: 200, type: SongOutputDTO, description: 'Retorna a música' })
    @Post('/')
    async create(@Req() req, @Body() data: SongInputDTO) {
        const song = await this.songService.createSong(data);
        return plainToInstance(SongOutputDTO, { ...song }, { excludeExtraneousValues: true });
    }

    @UseGuards(JwtAuthGuardAdmin)
    @ApiOperation({ summary: 'Alterar música' })
    @ApiResponse({ status: 200, type: SongOutputDTO, description: 'Retorna a música' })
    @Patch('/:id')
    async update(@Req() req, @Body() data: SongInputUpdateDTO, @Param('id') id: string) {
        const song = await this.songService.updateSong(data, id);
        return plainToInstance(SongOutputDTO, song, { excludeExtraneousValues: true });
    }

    @UseGuards(JwtAuthGuardAdmin)
    @ApiOperation({ summary: 'Deletar música' })
    @ApiResponse({ status: 200, type: Boolean, description: 'Retorna true' })
    @Delete('/:id')
    async delete(@Req() req, @Param('id') id: string) {
        return await this.songService.deleteSong(id);
    }
}

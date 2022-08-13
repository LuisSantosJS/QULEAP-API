import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard, JwtAuthGuardAdmin } from 'src/services/auth/guard/jwt-auth.guard';
import { SongOutputDTO } from 'src/services/song/dto/song.dto';
import { UserInputDTO, UserInputUpdateDTO, UserOutputDTO } from 'src/services/user/dto/user.dto';
import { UserService } from 'src/services/user/user.service';


@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(JwtAuthGuardAdmin)
    @ApiOperation({ summary: 'Listar usuários' })
    @ApiResponse({ status: 200, type: [UserOutputDTO], description: 'Retorna a lista de usuários' })
    @Get('/all')
    async all(@Req() req) {
        const users = await this.userService.listUsers();
        return plainToInstance(UserOutputDTO, users, { excludeExtraneousValues: true });
    }

    @UseGuards(JwtAuthGuardAdmin)
    @ApiOperation({ summary: 'Exibir detalhes de um usuário' })
    @ApiResponse({ status: 200, type: UserOutputDTO, description: 'Retorna detalhes de um usuário' })
    @Get('/details/:id')
    async show(@Req() req, @Param('id') id: string) {
        const user = await this.userService.listUserDetails(id);
        return plainToInstance(UserOutputDTO, user, { excludeExtraneousValues: true });
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Exibir detalhes do usuário' })
    @ApiResponse({ status: 200, type: UserOutputDTO, description: 'Retorna detalhes de um usuário' })
    @Get('/details')
    async showUnique(@Req() req,) {
        const user = await this.userService.listUserDetails(req.user.id);
        return plainToInstance(UserOutputDTO, user, { excludeExtraneousValues: true });
    }

    @UseGuards(JwtAuthGuardAdmin)
    @ApiOperation({ summary: 'Criar usuário' })
    @ApiResponse({ status: 200, type: UserOutputDTO, description: 'Retorna o usuário' })
    @Post('/')
    async create(@Req() req, @Body() data: UserInputDTO) {
        const user = await this.userService.createUser(data);
        return plainToInstance(UserOutputDTO, { ...user }, { excludeExtraneousValues: true });
    }

    @UseGuards(JwtAuthGuardAdmin)
    @ApiOperation({ summary: 'Alterar usuário' })
    @ApiResponse({ status: 200, type: UserOutputDTO, description: 'Retorna o usuário' })
    @Patch('/:id')
    async update(@Req() req, @Body() data: UserInputUpdateDTO, @Param('id') id: string) {
        const user = await this.userService.updateUser(data, id);
        return plainToInstance(UserOutputDTO, user, { excludeExtraneousValues: true });
    }

    @UseGuards(JwtAuthGuardAdmin)
    @ApiOperation({ summary: 'Deletar usuário' })
    @ApiResponse({ status: 200, type: Boolean, description: 'Retorna true' })
    @Delete('/:id')
    async delete(@Req() req, @Param('id') id: string) {
        return await this.userService.deleteUser(id);
    }


    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Listar playlist do usuário' })
    @ApiResponse({ status: 200, type: [SongOutputDTO], description: 'Retorna uma playlist' })
    @Get('/songs')
    async showSongs(@Req() req,) {
        const songs = await this.userService.listSongs(req.user.id);
        return plainToInstance(SongOutputDTO, songs, { excludeExtraneousValues: true });
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Adiciona uma música a playlist do usuário' })
    @ApiResponse({ status: 200, type: SongOutputDTO, description: 'Retorna a música' })
    @Put('/songs/:songId')
    async addSongs(@Req() req, @Param('songId') songId: string) {
        const songs = await this.userService.addSong(req.user.id, songId);
        return plainToInstance(SongOutputDTO, songs, { excludeExtraneousValues: true });
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Remove uma música a playlist do usuário' })
    @ApiResponse({ status: 200, type: Boolean, description: 'Retorna true' })
    @Delete('/songs/:songId')
    async removeSongs(@Req() req, @Param('songId') songId: string) {
        return await this.userService.removeSong(req.user.id, songId);

    }


}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth/auth.service';
import { LoginInputDTO, LoginOutpuDTO } from 'src/services/auth/dto/auth.dto';


@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({ summary: 'Gerar Token de Acesso', })
  @ApiResponse({ status: 200, type: LoginOutpuDTO, description: 'Retorna o token de acesso para utilizar na api' })
  @Post('/login')
  async login(@Body() data: LoginInputDTO) {
    return await this.authService.validateUser(data.email, data.password);
  }


}

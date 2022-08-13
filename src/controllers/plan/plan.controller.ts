import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuardAdmin } from 'src/services/auth/guard/jwt-auth.guard';
import { PlanInputDTO, PlanInputUpdateDTO, PlanOutputDTO } from 'src/services/plan/dto/plan.dto';
import { PlanService } from 'src/services/plan/plan.service';



@Controller('plan')
@ApiTags('Plan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuardAdmin)
export class PlanController {
    constructor(private planService: PlanService) { }

    @ApiOperation({ summary: 'Listar planos' })
    @ApiResponse({ status: 200, type: [PlanOutputDTO], description: 'Retorna a lista de planos' })
    @Get('/all')
    async all(@Req() req) {
        const plans = await this.planService.listPlans();
        return plans.map(e => plainToInstance(PlanOutputDTO, e, { excludeExtraneousValues: true })) 
    }


    @ApiOperation({ summary: 'Criar plano' })
    @ApiResponse({ status: 200, type: PlanOutputDTO, description: 'Retorna o plano' })
    @Post('/')
    async create(@Req() req, @Body() data: PlanInputDTO) {
        const plan =  await this.planService.createPlan(data);
        return plainToInstance(PlanOutputDTO, plan, { excludeExtraneousValues: true })
    }

    @ApiOperation({ summary: 'Alterar plano' })
    @ApiResponse({ status: 200, type: PlanOutputDTO, description: 'Retorna o plnao' })
    @Patch('/:id')
    async update(@Req() req, @Body() data: PlanInputUpdateDTO, @Param('id') id: string) {
        const plan =  await this.planService.updatePlan(data, id);
        return plainToInstance(PlanOutputDTO, plan, { excludeExtraneousValues: true })
    }

}

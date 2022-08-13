import { Injectable, NotFoundException } from '@nestjs/common';
import { Plan } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PlanInputDTO, PlanInputUpdateDTO } from './dto/plan.dto';


@Injectable()
export class PlanService {
    constructor( private prisma: PrismaService) { }
    public async listPlans(): Promise<Plan[]> {
        return await this.prisma.plan.findMany()
    }
    async createPlan(data: PlanInputDTO): Promise<Plan> {
        const plan = await this.prisma.plan.findFirst({
            where: {
                description: data.description
            }
        })
        if (!!plan) {
            throw new NotFoundException(["Plan already exists"])
        }
        return await this.prisma.plan.create({
            data: data
        })
    }

    async updatePlan(data: PlanInputUpdateDTO, id: string): Promise<Plan> {
        const plan = await this.prisma.plan.findFirst({
            where: {
                id
            }
        })
        if (!plan) {
            throw new NotFoundException(["Plan not found"])
        }
        return await this.prisma.plan.update({
            where: {
                id
            },
            data: {
                ...plan,
                ...data
            }
        })
    }
}
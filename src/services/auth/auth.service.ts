import { ConflictException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginOutpuDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private prisma: PrismaService) { }

    async validateUser(email: string, password: string): Promise<LoginOutpuDTO> {
        const user = await this.prisma.user.findFirst({
            where: {
                email,
            }
        })
        if (!user) {
            throw new NotFoundException(['User not found']);
        }
console.log(password, user.password)
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            throw new ConflictException(['Invalid password']);
        }
        const roles = await this.prisma.userRoleMap.findMany({
            where: {
                userId: user.id,
            },
            select: {
                role: {
                    select: {
                        description: true
                    }
                }
            }
        });

        const access_token = await this.login(user.id, user.email, roles.map(res => res.role.description));
        return {
            token: access_token,
            roles: roles.map(res => res.role.description)
        }
    }

    private async login(id: string, email: string, roles: string[]): Promise<string> {
        const payload = { id, email, roles };
        const access_token = await this.jwtService.sign(payload);
        return access_token;
    }

    public headers(token: string) {
        return {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                'Authorization': 'Bearer ' + token
            }
        }
    }
}
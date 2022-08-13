import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import Axios from 'axios'
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { SongOutputDTO } from '../song/dto/song.dto';
import { UserInputDTO, UserInputUpdateDTO, UserOutputDTO } from './dto/user.dto';


@Injectable()
export class UserService {
    constructor(private authService: AuthService, private prisma: PrismaService) { }
    public async listUsers(): Promise<User[]> {
        return await this.prisma.user.findMany({
            where: {
                UserRoleMap: {
                    some: {
                        role: {
                            description: 'user'
                        }
                    }
                }
            }
        })
    }

    public async listUserDetails(id: string): Promise<User> {
        return await this.prisma.user.findFirst({
            where: {
                id: id,
                UserRoleMap: {
                    some: {
                        role: {
                            description: 'user'
                        }
                    }
                }
            },
            include:{
                plan: true
            }
        })
    }

    private async userRoleMap(userId: string) {
        return await this.prisma.userRoleMap.create({
            data: {
                role: {
                    connect: {
                        description: 'user'
                    }

                },
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    }
    public async createUser(data: UserInputDTO): Promise<User> {
        const plan = await this.prisma.plan.findFirst({
            where: {
                id: data.planId
            }
        })
        if (!plan) {
            throw new NotFoundException(["Plan not found"])
        }
        const isExistUser = await this.prisma.user.findFirst({
            where: {
                email: data.email
            },
            include: {
                UserRoleMap: {
                    where: {
                        user: {
                            email: data.email
                        }
                    },
                    include: {
                        role: true
                    }
                },
                plan: true
            }
        });
        if (!!isExistUser) {
            if (isExistUser.UserRoleMap.filter(res => res.role.description == 'user').length > 0) {
                throw new ConflictException(["User already exists"])
            } else {
                await this.prisma.user.update({
                    where: {
                        id: isExistUser.id,
                    },
                    data: {
                        plan: {
                            connect: {
                                id: plan.id
                            }
                        }
                    }
                })
                await this.userRoleMap(isExistUser.id)
            }
            return isExistUser;
        } else {
            const salt = bcrypt.genSaltSync(4);
            const hash = bcrypt.hashSync(data.password, salt);
            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hash,
                    plan: {
                        connect: {
                            id: plan.id
                        }
                    }
                },
                include: {
                    plan: true
                }
            });
            await this.userRoleMap(user.id)
            return user;
        }
    }

    public async updateUser(data: UserInputUpdateDTO, id: string): Promise<UserOutputDTO> {
        const user = await this.listUserDetails(id);
        if (!user) {
            throw new NotFoundException(['User not found'])
        }
        if (!!data?.planId) {
            const plan = await this.prisma.plan.findFirst({
                where: {
                    id: data.planId
                }
            });
            if (!plan) {
                throw new NotFoundException(['Plan not found'])
            } else {
                await this.prisma.userSongMap.deleteMany({
                    where: {
                        userId: id,
                        song: {
                            SongPlanMap: {
                                some: {
                                    planId: { not: plan.id }
                                }
                            }
                        }
                    }
                })
            }
        }
        if (!!data?.password) {
            const salt = bcrypt.genSaltSync(4);
            const hash = bcrypt.hashSync(data.password, salt);
            data.password = hash
        }

        return await this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                ...(!!data?.planId ? {
                    plan: {
                        connect: {
                            id: data?.planId
                        }
                    }
                } : {}),
                ...(!!data?.password ? {
                    password: data.password
                } : {})


            },
            include: {
                plan: true
            }
        })
    }

    public async deleteUser(id: string): Promise<Boolean> {
        const user = await this.prisma.user.findFirst({
            where: {
                id: id
            }
        });
        if (!user) {
            throw new NotFoundException(['User not found'])
        }
        await this.prisma.userSongMap.deleteMany({
            where: {
                userId: id
            }
        })
        await this.prisma.userRoleMap.deleteMany({
            where: {
                userId: id
            }
        })
        const response = await this.prisma.user.delete({
            where: {
                id: id
            }
        })
        return !!response
    }

    public async listSongs(id: string): Promise<SongOutputDTO[]> {
        const songs = await this.prisma.userSongMap.findMany({
            where: {
                userId: id
            },
            select: {
                song: true
            }
        });
        return songs.map(res => res.song);
    }

    public async addSong(id: string, songId: string): Promise<SongOutputDTO> {
        const song = await this.prisma.song.findFirst({
            where: {
                id: songId
            }
        });
        if (!song) {
            throw new NotFoundException(["Song not found"])
        }
        const songsCount = await this.prisma.userSongMap.count({
            where: {
                userId: id
            }
        });
        const user = await this.prisma.user.findFirst({
            where: {
                id
            },
            select: {
                plan: true
            }
        });
        if (songsCount === user.plan.maxSong) {
            throw new ConflictException(["Song limit reached"])
        }
        const res = await this.prisma.userSongMap.create({
            data: {
                song: {
                    connect: {
                        id: songId
                    }
                },
                user: {
                    connect: {
                        id: id
                    }
                },
            },
            select: {
                song: true
            }
        })
        return res.song
    }

    public async removeSong(id: string, songId: string): Promise<boolean> {
        const song = await this.prisma.userSongMap.findFirst({
            where: {
                userId: id,
                songId
            }
        });
        if (!song) {
            throw new NotFoundException(["Song not found"])
        }
        await this.prisma.userSongMap.delete({
            where:{
                id: song.id
            }
        })
        return true
    }
}
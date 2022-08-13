import { Injectable, NotFoundException } from '@nestjs/common';
import { Song } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SongInputDTO, SongInputUpdateDTO } from './dto/song.dto';


@Injectable()
export class SongService {
    constructor(private prisma: PrismaService) { }
    public async listSongs(userId: string): Promise<Song[]> {

        const user = await this.prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                planId: true
            }
        });
         if(!user?.planId){
            throw new NotFoundException(["Plan not found"])
         }

        return await this.prisma.song.findMany({
            where: {
                SongPlanMap: {
                    some: {
                        planId: user.planId
                    }
                }
            }
        })
    }
    async createSong(data: SongInputDTO): Promise<Song> {
        const isSongExist = await this.prisma.song.findFirst({
            where: {
                name: data.name
            }
        })
        if (!!isSongExist) {
            throw new NotFoundException(["Song already exists"])
        }
        const song = await this.prisma.song.create({
            data: {
                name: data.name
            }
        });

        for (const plan0 of data.plans) {
            const plan = await this.prisma.plan.findFirst({
                where: {
                    OR: [
                        {
                            id: plan0
                        },
                        {
                            description: plan0
                        }
                    ]
                }
            })
            if (!!plan) {
                await this.prisma.songPlanMap.create({
                    data: {
                        plan: {
                            connect: {
                                description: plan.description
                            }
                        },
                        song: {
                            connect: {
                                id: song.id
                            }
                        }
                    }
                })
            }

        }

        return song
    }

    async updateSong(data: SongInputUpdateDTO, id: string): Promise<Song> {
        const song = await this.prisma.song.findFirst({
            where: {
                id
            },
            include: {
                SongPlanMap: {
                    where: {
                        songId: id
                    },
                    include: {
                        plan: true
                    }
                }
            }
        })
        if (!song) {
            throw new NotFoundException(["Song not found"])
        }
        if (!!data?.plans && data?.plans.length > 0) {
            const oldPlans = song.SongPlanMap.map(res => res.plan);
            const removePlans = oldPlans.filter(res => data.plans.find(e => e !== res.id && e !== res.description));
            if (!!removePlans && removePlans.length > 0) {
                await this.prisma.userSongMap.deleteMany({
                    where: {
                        song: {
                            SongPlanMap: {
                                some: {
                                    plan: {
                                        id: { in: removePlans.map(res => res.id) }
                                    },
                                    songId: id
                                }
                            }
                        }
                    }
                })
                await this.prisma.songPlanMap.deleteMany({
                    where: {
                        songId: id,
                        plan: {
                            id: { in: removePlans.map(res => res.id) }
                        }
                    }
                })
            }
            const newPlans = await this.prisma.plan.findMany({
                where: {
                    AND: [
                        {
                            id: { notIn: oldPlans.map(res => res.id) }
                        },
                        {
                            OR: [
                                {
                                    id: {
                                        in: data?.plans
                                    }
                                },
                                {
                                    description: {
                                        in: data?.plans
                                    }
                                }
                            ]
                        }
                    ]

                }
            });
            for (const newPlan of newPlans) {
                await this.prisma.songPlanMap.create({
                    data: {
                        plan: {
                            connect: {
                                id: newPlan.id
                            }
                        },
                        song: {
                            connect: {
                                id: id
                            }
                        }
                    }
                })
            }
        }
        return song
    }

    async deleteSong(id: string): Promise<boolean> {
        const song = await this.prisma.song.findFirst({
            where: {
                id
            },
            include: {
                SongPlanMap: {
                    where: {
                        songId: id
                    },
                    include: {
                        plan: true
                    }
                }
            }
        })
        if (!song) {
            throw new NotFoundException(["Song not found"])
        }

        await this.prisma.userSongMap.deleteMany({
            where: {
                songId: id
            }
        })
        await this.prisma.songPlanMap.deleteMany({
            where: {
                songId: id,
            }
        })
        await this.prisma.song.delete({
            where: {
                id: id
            }
        });
        return true
    }
}
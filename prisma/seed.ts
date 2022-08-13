import { PrismaService } from '../src/services/prisma/prisma.service';
const prisma = new PrismaService();
import * as bcrypt from 'bcrypt';


const upsertUserRole = async (role: string) => {
    return await prisma.userRole.upsert({
        where: {
            description: role
        },
        create: {
            description: role
        },
        update: {

        }
    })
}
const upsertPlan = async (description: string, title: string, max: number) => {
    return await prisma.plan.upsert({
        where: {
            description
        },
        create: {
            description,
            title,
            maxSong: max
        },
        update: {
            title,
            maxSong: max
        }
    })
}
const upsertUserAdmin = async (email: string, password: string) => {
    const role = 'admin'
    const salt = bcrypt.genSaltSync(4);
    const hash = bcrypt.hashSync(password, salt);
    const user = await prisma.user.upsert({
        where: {
            email: email
        },
        create: {
            email: email,
            password: hash
        },
        update: {
            password
        }
    });
    const roleMap = await prisma.userRoleMap.findFirst({
        where: {
            role: {
                description: role
            },
            userId: user.id
        }
    })
    if (!roleMap) {
        await prisma.userRoleMap.create({
            data: {
                user: {
                    connect: {
                        id: user.id
                    }
                },
                role: {
                    connect: {
                        description: role
                    }
                }
            }
        })
    }

}

const upsertSong = async (name: string, plans: string[]) => {
    const song = await prisma.song.upsert({
        where: {
            name
        },
        create: {
            name
        },
        update: {

        }
    });


    for (const plan of plans) {
        const songPlan = await prisma.songPlanMap.findFirst({
            where: {
                songId: song.id,
                plan: {
                    description: plan
                }
            }
        });
        if (!songPlan) {
            await prisma.songPlanMap.create({
                data: {
                    song: {
                        connect: {
                            id: song.id
                        }
                    },
                    plan: {
                        connect: {
                            description: plan
                        }
                    }
                }
            })
        }

    }
}
const main = async () => {
    await upsertUserRole('admin');
    await upsertUserRole('user');

    await upsertPlan('basic', 'Basic', 3)
    await upsertPlan('gold', 'Gold', 5)
    await upsertSong('Orient', ['basic', 'gold'])
    await upsertSong('Chiptune', ['gold'])
    await upsertSong('EDM', ['basic', 'gold'])
    await upsertSong('Chillout', ['gold'])
    await upsertSong('Dubstep', ['gold'])
    await upsertSong('Winter', ['basic', 'gold'])
    await upsertSong('Summer', ['basic', 'gold'])
    await upsertSong('Ocarina', ['gold'])

    await upsertUserAdmin('admin@admin.com', '12345678');


};

main();
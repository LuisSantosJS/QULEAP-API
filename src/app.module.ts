import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthController } from './controllers/auth/auth.controller';
import { PlanController } from './controllers/plan/plan.controller';
import { SongController } from './controllers/song/song.controller';
import { UserController } from './controllers/user/user.controller';
import { HttpExceptionFilter } from './http-exception.filter';
import { AuthService } from './services/auth/auth.service';
import { JwtStrategy } from './services/auth/guard/jwt.strategy';
import { PlanService } from './services/plan/plan.service';
import { PrismaService } from './services/prisma/prisma.service';
import { SongService } from './services/song/song.service';
import { UserService } from './services/user/user.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '365d' },
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    PlanController,
    SongController
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AuthService,
    JwtStrategy,
    PrismaService,
    UserService,
    PlanService,
    SongService
  ],
})
export class AppModule { }

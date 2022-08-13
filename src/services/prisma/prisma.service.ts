import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public isConnected = false;

  constructor() {
    super();
  }
  async onModuleInit() {
    await this.$connect();
    this.isConnected = true;
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.isConnected = false;
  }
}
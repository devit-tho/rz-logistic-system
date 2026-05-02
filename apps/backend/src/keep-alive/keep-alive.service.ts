import prisma from '@monorepo/database';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class KeepAliveService implements OnModuleInit, OnModuleDestroy {
  private interval: NodeJS.Timeout;

  onModuleInit() {
    this.interval = setInterval(async () => {
      await prisma.$runCommandRaw({ ping: 1 });
    }, 300000);
  }

  onModuleDestroy() {
    clearInterval(this.interval);
  }
}

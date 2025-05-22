import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    // Add truncate operations for testing purposes
    const models = Reflect.ownKeys(this).filter((key) => {
      return (
        typeof key === 'string' &&
        !key.startsWith('_') &&
        key !== '$connect' &&
        key !== '$disconnect' &&
        key !== '$on' &&
        key !== '$transaction' &&
        key !== '$use'
      );
    });

    return await this.$transaction(
      models.map((modelKey) => {
        const model = this[modelKey as string];
        if (typeof model.deleteMany === 'function') {
          return model.deleteMany({});
        }
        return Promise.resolve();
      }),
    );
  }
}

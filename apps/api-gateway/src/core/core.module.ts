import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { PrismaService } from './prisma.service';
import { CoreResolver } from './core.resolver';

@Module({
  providers: [
    PrismaService,
    CoreService,
    CoreResolver,
    { provide: 'CORE_SERVICE', useExisting: CoreService },
  ],
  exports: [CoreService, 'CORE_SERVICE'],
})
export class CoreModule {}

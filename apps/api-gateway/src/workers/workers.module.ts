import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { WorkersResolver } from './workers.resolver';
import { WorkersService } from './workers.service';

@Module({
  imports: [DatabaseModule],
  providers: [WorkersService, WorkersResolver],
})
export class WorkersModule {}

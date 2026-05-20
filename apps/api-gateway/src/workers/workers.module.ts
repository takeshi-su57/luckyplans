import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CredentialsResolver } from './credentials.resolver';
import { CredentialsService } from './credentials.service';
import { WorkersResolver } from './workers.resolver';
import { WorkersService } from './workers.service';

@Module({
  imports: [DatabaseModule],
  providers: [WorkersService, WorkersResolver, CredentialsService, CredentialsResolver],
  exports: [CredentialsService],
})
export class WorkersModule {}

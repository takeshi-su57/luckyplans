import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CredentialsResolver } from './credentials.resolver';
import { CredentialsService } from './credentials.service';
import { ReleasesResolver } from './releases.resolver';
import { ReleasesService } from './releases.service';
import { WorkersResolver } from './workers.resolver';
import { WorkersService } from './workers.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    WorkersService,
    WorkersResolver,
    CredentialsService,
    CredentialsResolver,
    ReleasesService,
    ReleasesResolver,
  ],
  exports: [CredentialsService, WorkersService, ReleasesService],
})
export class WorkersModule {}

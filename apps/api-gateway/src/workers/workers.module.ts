import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { CredentialsResolver } from './credentials.resolver';
import { CredentialsService } from './credentials.service';
import { EnrollmentTokensResolver } from './enrollment-tokens.resolver';
import { EnrollmentTokensService } from './enrollment-tokens.service';
import { ReleasesResolver } from './releases.resolver';
import { ReleasesService } from './releases.service';
import { WorkersResolver } from './workers.resolver';
import { WorkersService } from './workers.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [
    WorkersService,
    WorkersResolver,
    CredentialsService,
    CredentialsResolver,
    EnrollmentTokensService,
    EnrollmentTokensResolver,
    ReleasesService,
    ReleasesResolver,
  ],
  exports: [CredentialsService, WorkersService, ReleasesService, EnrollmentTokensService],
})
export class WorkersModule {}

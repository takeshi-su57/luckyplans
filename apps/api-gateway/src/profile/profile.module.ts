import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ProfileResolver } from './profile.resolver';
import { PortfolioResolver } from './portfolio.resolver';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    DatabaseModule,
  ],
  providers: [
    ProfileService,
    ProfileResolver,
    PortfolioResolver,
  ],
  exports: [ProfileService],
})
export class ProfileModule {}


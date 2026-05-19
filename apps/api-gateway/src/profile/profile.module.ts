import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CoreModule } from '../core/core.module';
import { ProfileResolver } from './profile.resolver';
import { PortfolioResolver } from './portfolio.resolver';

@Module({
  imports: [
    AuthModule,
    CoreModule,
  ],
  providers: [ProfileResolver, PortfolioResolver],
})
export class ProfileModule {}

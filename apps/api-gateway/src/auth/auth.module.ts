import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { AuthResolver } from './auth.resolver';
import { OidcController } from './oidc.controller';
import { SessionGuard } from './session.guard';
import { SessionService } from './session.service';

@Module({
  imports: [CoreModule],
  controllers: [OidcController],
  providers: [AuthResolver, SessionGuard, SessionService],
  exports: [SessionService, SessionGuard],
})
export class AuthModule {}

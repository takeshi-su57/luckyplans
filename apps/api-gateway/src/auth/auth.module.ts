import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { OidcController } from './oidc.controller';
import { SessionGuard } from './session.guard';
import { SessionService } from './session.service';

@Module({
  controllers: [OidcController],
  providers: [AuthResolver, SessionGuard, SessionService],
  exports: [SessionService, SessionGuard],
})
export class AuthModule {}

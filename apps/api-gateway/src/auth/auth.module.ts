import { Module, forwardRef } from '@nestjs/common';
import { ProfileModule } from '../profile/profile.module';
import { AuthResolver } from './auth.resolver';
import { OidcController } from './oidc.controller';
import { SessionGuard } from './session.guard';
import { SessionService } from './session.service';

@Module({
  imports: [forwardRef(() => ProfileModule)],
  controllers: [OidcController],
  providers: [AuthResolver, SessionGuard, SessionService],
  exports: [SessionService, SessionGuard],
})
export class AuthModule {}


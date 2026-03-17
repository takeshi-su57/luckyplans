import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getEnvVar } from '@luckyplans/shared';
import { AuthResolver } from './auth.resolver';
import { OidcController } from './oidc.controller';
import { SessionGuard } from './session.guard';
import { SessionService } from './session.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CORE_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: getEnvVar('REDIS_HOST', 'localhost'),
          port: parseInt(getEnvVar('REDIS_PORT', '6379'), 10),
        },
      },
    ]),
  ],
  controllers: [OidcController],
  providers: [AuthResolver, SessionGuard, SessionService],
  exports: [SessionService, SessionGuard],
})
export class AuthModule {}

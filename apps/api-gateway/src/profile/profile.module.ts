import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getEnvVar } from '@luckyplans/shared';
import { AuthModule } from '../auth/auth.module';
import { ProfileResolver } from './profile.resolver';
import { PortfolioResolver } from './portfolio.resolver';

@Module({
  imports: [
    AuthModule,
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
  providers: [ProfileResolver, PortfolioResolver],
})
export class ProfileModule {}

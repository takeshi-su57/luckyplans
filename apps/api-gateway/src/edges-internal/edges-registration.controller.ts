import { Body, Controller, Headers, UnauthorizedException, Post } from '@nestjs/common';
import { WorkersService } from '../workers/workers.service';
import { CredentialsService } from '../workers/credentials.service';
import { EnrollmentTokensService } from '../workers/enrollment-tokens.service';

@Controller('internal/edges')
export class EdgesRegistrationController {
  constructor(
    private readonly workersService: WorkersService,
    private readonly credentialsService: CredentialsService,
    private readonly enrollmentTokensService: EnrollmentTokensService,
  ) {}

  @Post('register')
  async register(
    @Body()
    body: {
      token?: string;
      displayName: string;
      deviceNumber: string;
      platform?: string;
      arch?: string;
      edgeVersion?: string;
    },
    @Headers('authorization') authorization?: string,
  ) {
    const bearerToken = this.extractBearerToken(authorization);
    await this.assertRegistrationToken(body.token ?? bearerToken);

    const worker = await this.workersService.upsertWorkerByDeviceNumber({
      deviceNumber: body.deviceNumber,
      name: body.displayName,
      platform: body.platform,
      arch: body.arch,
      version: body.edgeVersion,
    });
    const issued = await this.credentialsService.issueCredential(worker.id);

    return {
      workerId: worker.id,
      credential: issued.credential,
      deviceNumber: worker.deviceNumber,
    };
  }

  private async assertRegistrationToken(token: string | undefined) {
    if (!token) {
      throw new UnauthorizedException('Invalid registration token');
    }

    const verified = await this.enrollmentTokensService.verifyAndConsume(token);
    if (!verified.ok) {
      throw new UnauthorizedException('Invalid registration token');
    }
  }

  private extractBearerToken(authorization?: string): string | undefined {
    if (!authorization) return undefined;
    const match = /^Bearer\s+(.+)$/i.exec(authorization.trim());
    return match?.[1];
  }
}

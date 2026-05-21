import {
  Body,
  Controller,
  InternalServerErrorException,
  UnauthorizedException,
  Post,
} from '@nestjs/common';
import { getEnvVar } from '@luckyplans/shared';
import { WorkersService } from '../workers/workers.service';
import { CredentialsService } from '../workers/credentials.service';

@Controller('internal/edges')
export class EdgesRegistrationController {
  constructor(
    private readonly workersService: WorkersService,
    private readonly credentialsService: CredentialsService,
  ) {}

  @Post('register')
  async register(
    @Body()
    body: {
      token: string;
      displayName: string;
      deviceNumber: string;
      platform?: string;
      arch?: string;
      edgeVersion?: string;
    },
  ) {
    this.assertRegistrationToken(body.token);

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

  private assertRegistrationToken(token: string) {
    let expected: string;
    try {
      expected = getEnvVar('EDGE_REGISTRATION_TOKEN');
    } catch {
      throw new InternalServerErrorException(
        'Server misconfiguration: EDGE_REGISTRATION_TOKEN is not configured',
      );
    }

    if (!token || token !== expected) {
      throw new UnauthorizedException('Invalid registration token');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CredentialsService } from '../workers/credentials.service';

@Injectable()
export class WorkerAuthService {
  constructor(private readonly credentialsService: CredentialsService) {}

  async verifyCredential(rawCredential: string) {
    return this.credentialsService.verifyCredential(rawCredential);
  }
}

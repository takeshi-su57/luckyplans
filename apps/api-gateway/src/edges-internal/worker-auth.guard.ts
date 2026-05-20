import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { WorkerAuthService } from './worker-auth.service';

@Injectable()
export class WorkerAuthGuard implements CanActivate {
  constructor(private readonly workerAuthService: WorkerAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Record<string, unknown>>();
    const authorization = (req.headers as Record<string, string | undefined>)?.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing worker credential');
    }

    const rawCredential = authorization.slice('Bearer '.length).trim();
    const verified = await this.workerAuthService.verifyCredential(rawCredential);
    if (!verified) {
      throw new UnauthorizedException('Invalid worker credential');
    }

    req.worker = verified;
    return true;
  }
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { AuthUser } from '@luckyplans/shared';
import { SessionService } from './session.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<{ req: Record<string, unknown> }>().req;
    const cookies = req['cookies'] as Record<string, string> | undefined;
    const sessionId = cookies?.['session_id'];

    if (!sessionId) {
      throw new UnauthorizedException('Missing session');
    }

    const session = await this.sessionService.getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    // Transparently refresh the access token if near expiry
    const refreshed = await this.sessionService.refreshIfNeeded(sessionId, session);

    req['user'] = {
      userId: refreshed.userId,
      email: refreshed.email,
      name: refreshed.name,
      roles: refreshed.roles,
    } satisfies AuthUser;

    return true;
  }
}

import { Inject, InternalServerErrorException, Logger, UseGuards } from '@nestjs/common';
import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CoreMessagePattern, injectTraceContext } from '@luckyplans/shared';
import type { AuthUser } from '@luckyplans/shared';
import { CurrentUser } from './current-user.decorator';
import { SessionGuard } from './session.guard';

@ObjectType()
export class UserProfile {
  @Field()
  userId!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => [String])
  roles!: string[];

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  headline?: string;

  @Field({ nullable: true })
  location?: string;
}

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(@Inject('CORE_SERVICE') private readonly coreClient: ClientProxy) {}

  @Query(() => UserProfile)
  @UseGuards(SessionGuard)
  async me(@CurrentUser() user: AuthUser): Promise<UserProfile> {
    let profile: Record<string, unknown>;
    try {
      profile = await firstValueFrom(
        this.coreClient.send(
          CoreMessagePattern.GET_OR_CREATE_PROFILE,
          injectTraceContext({
            userId: user.userId,
            email: user.email,
            name: user.name,
          }),
        ),
      );
    } catch (err) {
      // NestJS microservice transport returns plain objects (not Error instances)
      // when the remote handler throws. Re-throw as a proper HttpException so
      // Apollo Server can format it correctly instead of an opaque 500.
      const message =
        err instanceof Error ? err.message : (err as { message?: string })?.message;
      this.logger.error(`Failed to fetch profile for user ${user.userId}: ${message}`);
      throw new InternalServerErrorException(
        message || 'Failed to fetch user profile',
      );
    }

    // Guard against the microservice returning an error-shaped response
    // (e.g. { status: 'error', message: '...' }) instead of throwing.
    if (profile && (profile as { status?: string }).status === 'error') {
      const message = (profile as { message?: string }).message || 'Profile service error';
      this.logger.error(`Profile service returned error for user ${user.userId}: ${message}`);
      throw new InternalServerErrorException(message);
    }

    return { ...(profile as Record<string, unknown>), roles: user.roles } as UserProfile;
  }
}

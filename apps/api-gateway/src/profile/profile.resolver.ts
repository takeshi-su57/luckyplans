import { Inject, UseGuards } from '@nestjs/common';
import { Args, InputType, Field, Mutation, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CoreMessagePattern, injectTraceContext } from '@luckyplans/shared';
import type { AuthUser } from '@luckyplans/shared';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionGuard } from '../auth/session.guard';
import { UserProfile } from '../auth/auth.resolver';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  bio?: string;
}

@Resolver()
export class ProfileResolver {
  constructor(@Inject('CORE_SERVICE') private readonly coreClient: ClientProxy) {}

  @Mutation(() => UserProfile)
  @UseGuards(SessionGuard)
  async updateProfile(
    @CurrentUser() user: AuthUser,
    @Args('input') input: UpdateProfileInput,
  ): Promise<UserProfile> {
    const profile = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.UPDATE_PROFILE,
        injectTraceContext({ userId: user.userId, ...input }),
      ),
    );
    return { ...profile, roles: user.roles };
  }
}

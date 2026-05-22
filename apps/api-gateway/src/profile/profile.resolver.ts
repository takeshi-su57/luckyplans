import { UseGuards } from '@nestjs/common';
import { Args, Field, InputType, Mutation, Resolver } from '@nestjs/graphql';
import type { AuthUser } from '@luckyplans/shared';
import { UserProfile } from '../auth/auth.resolver';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionGuard } from '../auth/session.guard';
import { ProfileService } from './profile.service';

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

  @Field({ nullable: true })
  headline?: string;

  @Field({ nullable: true })
  location?: string;
}

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Mutation(() => UserProfile)
  @UseGuards(SessionGuard)
  async updateProfile(
    @CurrentUser() user: AuthUser,
    @Args('input') input: UpdateProfileInput,
  ): Promise<UserProfile> {
    const profile = await this.profileService.updateProfile(user.userId, input);
    return { ...(profile ?? {}), roles: user.roles } as UserProfile;
  }
}

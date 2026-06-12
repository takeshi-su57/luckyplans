import { InternalServerErrorException, Logger, UseGuards } from '@nestjs/common';
import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import type { AuthUser, UserProfileData } from '@luckyplans/shared';
import { CurrentUser } from './current-user.decorator';
import { SessionGuard } from './session.guard';
import { ProfileService } from '../profile/profile.service';

@ObjectType()
export class UserProfile {
  @Field(() => String)
  userId!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => [String])
  roles!: string[];

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => String, { nullable: true })
  headline?: string;

  @Field(() => String, { nullable: true })
  location?: string;
}

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(private readonly profileService: ProfileService) {}

  @Query(() => UserProfile)
  @UseGuards(SessionGuard)
  async me(@CurrentUser() user: AuthUser): Promise<UserProfile> {
    let profile: UserProfileData;
    try {
      profile = await this.profileService.getOrCreateProfile({
        userId: user.userId,
        email: user.email,
        name: user.name,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : (err as { message?: string })?.message;
      this.logger.error(`Failed to fetch profile for user ${user.userId}: ${message}`);
      throw new InternalServerErrorException(message || 'Failed to fetch user profile');
    }

    return { ...profile, roles: user.roles };
  }
}

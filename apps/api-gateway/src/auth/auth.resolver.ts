import { Inject, UseGuards } from '@nestjs/common';
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
}

@Resolver()
export class AuthResolver {
  constructor(@Inject('CORE_SERVICE') private readonly coreClient: ClientProxy) {}

  @Query(() => UserProfile)
  @UseGuards(SessionGuard)
  async me(@CurrentUser() user: AuthUser): Promise<UserProfile> {
    const profile = await firstValueFrom(
      this.coreClient.send(
        CoreMessagePattern.GET_OR_CREATE_PROFILE,
        injectTraceContext({
          userId: user.userId,
          email: user.email,
          name: user.name,
        }),
      ),
    );
    return { ...profile, roles: user.roles };
  }
}

import { UseGuards } from '@nestjs/common';
import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import type { AuthUser } from '@luckyplans/shared';
import { CurrentUser } from './current-user.decorator';
import { SessionGuard } from './session.guard';

@ObjectType()
class UserProfile {
  @Field()
  userId!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => [String])
  roles!: string[];
}

@Resolver()
export class AuthResolver {
  @Query(() => UserProfile)
  @UseGuards(SessionGuard)
  me(@CurrentUser() user: AuthUser): UserProfile {
    return user;
  }
}

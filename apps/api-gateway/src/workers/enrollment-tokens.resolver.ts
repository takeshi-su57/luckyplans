import { UseGuards } from '@nestjs/common';
import { Args, Field, ID, Int, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { SessionGuard } from '../auth/session.guard';
import { EnrollmentTokensService } from './enrollment-tokens.service';

@ObjectType()
class EdgeEnrollmentToken {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  label?: string | null;

  @Field(() => String)
  tokenPrefix!: string;

  @Field(() => String)
  status!: 'ACTIVE' | 'REVOKED';

  @Field(() => Date, { nullable: true })
  expiresAt?: Date | null;

  @Field(() => Int, { nullable: true })
  maxUses?: number | null;

  @Field(() => Int)
  usedCount!: number;

  @Field(() => Date, { nullable: true })
  lastUsedAt?: Date | null;

  @Field(() => Date, { nullable: true })
  revokedAt?: Date | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
class CreatedEdgeEnrollmentToken extends EdgeEnrollmentToken {
  @Field(() => String)
  token!: string;
}

@Resolver()
export class EnrollmentTokensResolver {
  constructor(private readonly enrollmentTokensService: EnrollmentTokensService) {}

  @Query(() => [EdgeEnrollmentToken])
  @UseGuards(SessionGuard)
  async edgeEnrollmentTokens(): Promise<EdgeEnrollmentToken[]> {
    return this.enrollmentTokensService.listTokens();
  }

  @Mutation(() => CreatedEdgeEnrollmentToken)
  @UseGuards(SessionGuard)
  async createEdgeEnrollmentToken(
    @Args('label', { nullable: true }) label?: string,
    @Args('expiresAt', { nullable: true }) expiresAt?: Date,
    @Args('maxUses', { nullable: true, type: () => Int }) maxUses?: number,
  ): Promise<CreatedEdgeEnrollmentToken> {
    return this.enrollmentTokensService.createToken({ label, expiresAt, maxUses });
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async revokeEdgeEnrollmentToken(@Args('id') id: string): Promise<boolean> {
    return this.enrollmentTokensService.revokeToken(id);
  }
}

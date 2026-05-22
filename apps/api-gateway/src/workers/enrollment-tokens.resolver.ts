import { Args, Field, ID, Int, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { EnrollmentTokensService } from './enrollment-tokens.service';

@ObjectType()
class EdgeEnrollmentToken {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  label?: string | null;

  @Field()
  tokenPrefix!: string;

  @Field()
  status!: 'ACTIVE' | 'REVOKED';

  @Field({ nullable: true })
  expiresAt?: Date | null;

  @Field(() => Int, { nullable: true })
  maxUses?: number | null;

  @Field(() => Int)
  usedCount!: number;

  @Field({ nullable: true })
  lastUsedAt?: Date | null;

  @Field({ nullable: true })
  revokedAt?: Date | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
class CreatedEdgeEnrollmentToken extends EdgeEnrollmentToken {
  @Field()
  token!: string;
}

@Resolver()
export class EnrollmentTokensResolver {
  constructor(private readonly enrollmentTokensService: EnrollmentTokensService) {}

  @Query(() => [EdgeEnrollmentToken])
  async edgeEnrollmentTokens(): Promise<EdgeEnrollmentToken[]> {
    return this.enrollmentTokensService.listTokens();
  }

  @Mutation(() => CreatedEdgeEnrollmentToken)
  async createEdgeEnrollmentToken(
    @Args('label', { nullable: true }) label?: string,
    @Args('expiresAt', { nullable: true }) expiresAt?: Date,
    @Args('maxUses', { nullable: true, type: () => Int }) maxUses?: number,
  ): Promise<CreatedEdgeEnrollmentToken> {
    return this.enrollmentTokensService.createToken({ label, expiresAt, maxUses });
  }

  @Mutation(() => Boolean)
  async revokeEdgeEnrollmentToken(@Args('id') id: string): Promise<boolean> {
    return this.enrollmentTokensService.revokeToken(id);
  }
}

import { UseGuards } from '@nestjs/common';
import { Args, Field, ID, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { SessionGuard } from '../auth/session.guard';
import { CredentialsService } from './credentials.service';

@ObjectType()
class IssuedWorkerCredential {
  @Field(() => ID)
  id!: string;

  @Field()
  workerId!: string;

  @Field()
  keyPrefix!: string;

  @Field()
  credential!: string;
}

@Resolver()
export class CredentialsResolver {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Mutation(() => IssuedWorkerCredential)
  @UseGuards(SessionGuard)
  async issueWorkerCredential(@Args('id') id: string): Promise<IssuedWorkerCredential> {
    return this.credentialsService.issueCredential(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionGuard)
  async revokeWorkerCredential(@Args('id') id: string): Promise<boolean> {
    await this.credentialsService.revokeCredential(id);
    return true;
  }

  @Mutation(() => IssuedWorkerCredential)
  @UseGuards(SessionGuard)
  async rotateWorkerCredential(@Args('id') id: string): Promise<IssuedWorkerCredential> {
    return this.credentialsService.rotateCredential(id);
  }
}

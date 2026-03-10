import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, ObjectType, Field } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthMessagePattern } from '@luckyplans/shared';

@ObjectType()
class AuthResponse {
  @Field()
  success!: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  token?: string;
}

@Resolver()
export class AuthResolver {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  @Query(() => AuthResponse)
  async validateToken(@Args('token') token: string): Promise<AuthResponse> {
    return firstValueFrom(this.authClient.send(AuthMessagePattern.VALIDATE, { token }));
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthResponse> {
    return firstValueFrom(this.authClient.send(AuthMessagePattern.LOGIN, { email, password }));
  }

  @Mutation(() => AuthResponse)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
  ): Promise<AuthResponse> {
    return firstValueFrom(
      this.authClient.send(AuthMessagePattern.REGISTER, { email, password, name }),
    );
  }
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokensDto {
  @Field()
  token: string;

  @Field()
  tokenExpiration: Date;

  @Field()
  refreshToken: string;
}

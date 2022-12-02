import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
@ObjectType()
export class MovieDto {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Number)
  price: number;

  @Field()
  onSale: boolean;

  @Field(() => Int)
  quantity: number;
}

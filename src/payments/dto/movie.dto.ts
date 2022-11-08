import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
@ObjectType()
export class MovieDto {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

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

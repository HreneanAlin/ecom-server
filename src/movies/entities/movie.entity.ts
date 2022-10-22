import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
@Schema()
export class Movie {
  @Field(() => String, { description: 'the id of the movie' })
  _id: MongooseSchema.Types.ObjectId;

  @Field()
  @Prop()
  title: string;

  @Field(() => Int, { description: 'price in USD' })
  @Prop()
  price: number;
}

export type MovieDocument = Movie & Document;

export const MovieSchema = SchemaFactory.createForClass(Movie);

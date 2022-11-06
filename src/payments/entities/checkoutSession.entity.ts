import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
@Schema()
export class CheckoutSession {
  @Field(() => String, { description: 'the id of the checkout session' })
  _id: MongooseSchema.Types.ObjectId;

  @Field()
  @Prop()
  url: string;
}

export type CheckoutSessionDocument = CheckoutSession & Document;

export const CheckoutSessionSchema =
  SchemaFactory.createForClass(CheckoutSession);

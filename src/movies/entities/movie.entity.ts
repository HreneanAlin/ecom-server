import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { CheckoutSession } from 'src/payments/entities/checkoutSession.entity';

@ObjectType()
@Schema()
export class Movie {
  @Field(() => String, { description: 'the id of the movie' })
  _id: Types.ObjectId;

  @Field()
  @Prop()
  title: string;

  @Field()
  @Prop()
  description: string;

  @Field(() => Number, { description: 'price in USD' })
  @Prop()
  price: number;

  @Field()
  @Prop({
    default: false,
  })
  onSale: boolean;

  @Field(() => [CheckoutSession], { description: 'the checkouts of a movie' })
  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'CheckoutSession',
      },
    ],
  })
  checkoutSessions: CheckoutSession[];

  @Prop()
  stripePriceId: string;

  @Prop()
  stripeProductId: string;
}

export type MovieDocument = Movie & Document;

export const MovieSchema = SchemaFactory.createForClass(Movie);

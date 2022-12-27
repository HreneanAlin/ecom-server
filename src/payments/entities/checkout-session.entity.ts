import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MovieDto } from '../dto/movie.dto';

@ObjectType()
@Schema()
export class CheckoutSession {
  @Field(() => String, { description: 'the id of the checkout session' })
  _id: Types.ObjectId;

  @Field()
  @Prop({ unique: true })
  stripeSessionId: string;

  @Field()
  @Prop()
  url: string;

  @Field(() => [MovieDto])
  @Prop(
    raw({
      type: [
        {
          title: {
            type: String,
          },
          description: {
            type: String,
          },
          price: {
            type: Number,
          },
          onSale: {
            type: Boolean,
          },
          quantity: {
            type: Number,
          },
        },
      ],
    }),
  )
  movies: MovieDto[];

  @Field()
  @Prop()
  status: string;
}

export type CheckoutSessionDocument = CheckoutSession & Document;

export const CheckoutSessionSchema =
  SchemaFactory.createForClass(CheckoutSession);

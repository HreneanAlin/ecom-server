import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { MovieDto } from '../dto/movie.dto';

@ObjectType()
@Schema()
export class PaymentIntentRecord {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field()
  @Prop({ unique: true })
  stripeId: string;

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

export type PaymentIntentRecordDocument = PaymentIntentRecord & Document;

export const PaymentIntentRecordSchema =
  SchemaFactory.createForClass(PaymentIntentRecord);

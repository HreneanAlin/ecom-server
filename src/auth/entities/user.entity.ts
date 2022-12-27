import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { CheckoutSession } from 'src/payments/entities/checkout-session.entity';
import { MovieWithQuantityDTO } from 'src/movies/dto/movie-with-quantity.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaymentIntentRecord } from 'src/payments/entities/payment-intent-record.entity';

@ObjectType()
@Schema({
  timestamps: true,
})
export class User {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field()
  @Prop()
  firstName: string;

  @Field()
  @Prop()
  lastName: string;

  @Field()
  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  password: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [CheckoutSession])
  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'CheckoutSession',
      },
    ],
    default: [],
  })
  payments: CheckoutSession[];

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'PaymentIntentRecord',
      },
    ],
    default: [],
  })
  paymentsIntent: PaymentIntentRecord[];

  @Field(() => [MovieWithQuantityDTO])
  @Prop(
    raw({
      type: [
        {
          movie: {
            type: MongooseSchema.Types.ObjectId,
            ref: 'Movie',
          },
          quantity: {
            type: Number,
          },
        },
      ],
      default: [],
    }),
  )
  movies: MovieWithQuantityDTO[];

  @Prop()
  hashRefreshToken: string;

  @Prop()
  stripeCustomerId: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

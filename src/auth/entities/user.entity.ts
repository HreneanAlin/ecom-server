import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CheckoutSession } from 'src/payments/entities/checkoutSession.entity';
import { MovieWithQuantityDTO } from 'src/movies/dto/movie-with-quantity.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Schema({
  timestamps: true,
})
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

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

  @Field(() => [MovieWithQuantityDTO])
  @Prop(
    raw({
      movies: [
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
    }),
  )
  movies: MovieWithQuantityDTO[];

  @Prop()
  hashRefreshToken: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

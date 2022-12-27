import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SubscriptionPlan } from '../enums/subscription-plan.enum';
@ObjectType()
@Schema({
  timestamps: true,
})
export class AppSubscription {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  description: string;

  @Field(() => Number, { description: 'price in USD' })
  @Prop()
  price: number;

  @Field(() => SubscriptionPlan)
  @Prop({
    type: String,
    enum: SubscriptionPlan,
  })
  plan: keyof typeof SubscriptionPlan;

  @Prop()
  stripePriceId: string;

  @Prop()
  stripeProductId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type AppSubscriptionDocument = AppSubscription & Document;

export const AppSubscriptionSchema =
  SchemaFactory.createForClass(AppSubscription);

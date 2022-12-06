import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MovieDto } from '../dto/movie.dto';

@Schema()
export class PaymentIntentRecord {
  @Prop({ unique: true })
  stripeId: string;
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
  @Prop()
  status: string;
}

export type PaymentIntentRecordDocument = PaymentIntentRecord & Document;

export const PaymentIntentRecordSchema =
  SchemaFactory.createForClass(PaymentIntentRecord);

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentIntentRecordDto } from './dto/create-payment-intent-record.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

import {
  PaymentIntentRecord,
  PaymentIntentRecordDocument,
} from './entities/payment-intent-record.entity';

@Injectable()
export class PaymentIntentRecordsService {
  constructor(
    @InjectModel(PaymentIntentRecord.name)
    private readonly paymentIntentRecordModel: Model<PaymentIntentRecordDocument>,
  ) {}

  async create(
    paymentIntentRecordDto: CreatePaymentIntentRecordDto,
  ): Promise<PaymentIntentRecordDocument> {
    return this.paymentIntentRecordModel.create(paymentIntentRecordDto);
  }

  updateStatusByStripeId(
    stripeId: string,
    statusDto: UpdateStatusDto,
  ): Promise<PaymentIntentRecordDocument> {
    return this.paymentIntentRecordModel
      .findOneAndUpdate({ stripeId }, statusDto)
      .exec();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/auth/entities/user.entity';
import { UsersService } from 'src/auth/users.service';
import { CreatePaymentIntentRecordDto } from '../dto/create-payment-intent-record.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

import {
  PaymentIntentRecord,
  PaymentIntentRecordDocument,
} from '../entities/payment-intent-record.entity';

@Injectable()
export class PaymentIntentRecordsService {
  constructor(
    @InjectModel(PaymentIntentRecord.name)
    private readonly paymentIntentRecordModel: Model<PaymentIntentRecordDocument>,
    private readonly usersService: UsersService,
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

  async findByStripeId(stripeId: string, user: UserDocument) {
    const userWithPaymentsIntent = await this.usersService.findOne(user._id, [
      'paymentsIntent',
    ]);
    return userWithPaymentsIntent.paymentsIntent.find(
      (intent) => intent.stripeId === stripeId,
    );
  }
}

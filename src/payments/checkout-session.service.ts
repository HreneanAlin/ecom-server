import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { UpdateCheckoutSessionDto } from './dto/update-checkout-session.dto';
import {
  CheckoutSession,
  CheckoutSessionDocument,
} from './entities/checkoutSession.entity';

@Injectable()
export class CheckoutSessionService {
  constructor(
    @InjectModel(CheckoutSession.name)
    private readonly checkoutSessionModel: Model<CheckoutSessionDocument>,
  ) {}

  async create(
    checkoutSessionDto: CreateCheckoutSessionDto,
  ): Promise<CheckoutSession> {
    const createdCheckoutSession = await this.checkoutSessionModel.create(
      checkoutSessionDto,
    );
    return createdCheckoutSession.save();
  }

  findOneByStripeId(stripeSessionId: string): Promise<CheckoutSession> {
    return this.checkoutSessionModel.findOne({ stripeSessionId }).exec();
  }

  async updateByStripeId(
    stripeSessionId: string,
    updateCheckoutSessionDto: UpdateCheckoutSessionDto,
  ): Promise<CheckoutSession> {
    await this.checkoutSessionModel
      .findOneAndUpdate({ stripeSessionId }, updateCheckoutSessionDto)
      .exec();

    return this.findOneByStripeId(stripeSessionId);
  }
}

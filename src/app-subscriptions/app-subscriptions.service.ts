import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StripeService } from 'src/stripe/stripe.service';
import {
  AppSubscription,
  AppSubscriptionDocument,
} from './entities/app-subscription.entity';
import { CreateAppSubscriptionInput } from './inputs/create-app-subscription.input';

@Injectable()
export class AppSubscriptionsService {
  constructor(
    @InjectModel(AppSubscription.name)
    private readonly subscriptionModel: Model<AppSubscriptionDocument>,
    private readonly stripeService: StripeService,
  ) {}

  async create(
    createSubscriptionInput: CreateAppSubscriptionInput,
  ): Promise<AppSubscriptionDocument> {
    const product = await this.stripeService.createProductForSubscription(
      createSubscriptionInput.name,
      createSubscriptionInput.description,
    );
    const priceObject = await this.stripeService.createPrice(
      product.id,
      createSubscriptionInput.price,
    );
    return this.subscriptionModel.create({
      ...createSubscriptionInput,
      stripeProductId: product.id,
      stripePriceId: priceObject.id,
    });
  }

  findAll(): Promise<AppSubscription[]> {
    return this.subscriptionModel.find().exec();
  }

  findOne(id: string): Promise<AppSubscriptionDocument> {
    return this.subscriptionModel.findById(id).exec();
  }
}

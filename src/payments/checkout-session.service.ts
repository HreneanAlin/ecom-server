import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/auth/entities/user.entity';
import { UsersService } from 'src/auth/users.service';
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
    private readonly usersService: UsersService,
  ) {}

  async create(
    checkoutSessionDto: CreateCheckoutSessionDto,
  ): Promise<CheckoutSession> {
    return this.checkoutSessionModel.create(checkoutSessionDto);
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

  async findCurrentUsersOneByStripeId(
    stripeSessionId: string,
    user: UserDocument,
  ) {
    const fullUser = await this.usersService.findOne(user._id, ['payments']);
    const checkoutSession = fullUser.payments.find(
      (payment) => payment.stripeSessionId === stripeSessionId,
    );
    if (!checkoutSession) throw new NotFoundException();
    return checkoutSession;
  }
}

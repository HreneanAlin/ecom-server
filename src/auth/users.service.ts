import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUser } from './inputs/create-user.input';
import { User, UserDocument } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { CheckoutSession } from 'src/payments/entities/checkout-session.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  create(createUser: CreateUser): Promise<UserDocument> {
    return this.userModel.create(createUser);
  }

  findOne(_id: string, populatePaths?: string[]): Promise<UserDocument> {
    if (populatePaths) {
      return populatePaths
        .reduce((acc, path) => {
          return acc.populate({ path });
        }, this.userModel.findById(_id))
        .exec();
    }
    return this.userModel.findById(_id).exec();
  }

  findOneByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  findOneByCustomerId(customerId: string): Promise<UserDocument> {
    return this.userModel.findOne({ stripeCustomerId: customerId }).exec();
  }

  filterOpenPayments(userDto: UserDto): CheckoutSession[] {
    return userDto.payments.filter((payment) => payment.status === 'open');
  }
}

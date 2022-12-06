import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CheckoutSessionService } from './services/checkout-session.service';
import { CreatePaymentInput } from './inputs/create-payment.input';
import { CheckoutSession } from './entities/checkoutSession.entity';
import { PaymentsService } from './services/payments.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDocument } from 'src/auth/entities/user.entity';
import { PaymentIntentDTO } from './dto/payment-intent.dto';

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly checkoutSessionService: CheckoutSessionService,
  ) {}

  @Mutation(() => CheckoutSession)
  createCheckoutSession(
    @Args('createPayment') createPayment: CreatePaymentInput,
    @CurrentUser() user: UserDocument,
  ) {
    return this.paymentsService.createCheckoutSession(createPayment, user);
  }

  @Query(() => CheckoutSession, { name: 'checkoutSession' })
  findOne(@CurrentUser() user: UserDocument, @Args('id') id: string) {
    return this.checkoutSessionService.findCurrentUsersOneByStripeId(id, user);
  }

  @Mutation(() => PaymentIntentDTO)
  createPaymentIntent(
    @Args('createPayment') createPayment: CreatePaymentInput,
    @CurrentUser() user: UserDocument,
  ) {
    return this.paymentsService.createPaymentIntent(createPayment, user);
  }
}

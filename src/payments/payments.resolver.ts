import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateCheckoutSession } from './dto/create-checkout-session.input';
import { CheckoutSession } from './entities/checkoutSession.entity';
import { PaymentsService } from './payments.service';

@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Mutation(() => CheckoutSession)
  createCheckoutSession(
    @Args('createCheckoutSession') createCheckoutSession: CreateCheckoutSession,
  ) {
    return this.paymentsService.createCheckoutSession(createCheckoutSession);
  }
}

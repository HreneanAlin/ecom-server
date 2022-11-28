import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CheckoutSessionService } from './checkout-session.service';
import { CreateCheckoutSession } from './inputs/create-checkout-session.input';
import { CheckoutSession } from './entities/checkoutSession.entity';
import { PaymentsService } from './payments.service';

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly checkoutSessionService: CheckoutSessionService,
  ) {}

  @Mutation(() => CheckoutSession)
  createCheckoutSession(
    @Args('createCheckoutSession') createCheckoutSession: CreateCheckoutSession,
  ) {
    return this.paymentsService.createCheckoutSession(createCheckoutSession);
  }

  @Query(() => CheckoutSession, { name: 'checkoutSession' })
  findOne(@Args('id') id: string) {
    return this.checkoutSessionService.findOneByStripeId(id);
  }
}

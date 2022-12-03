import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CheckoutSessionService } from './checkout-session.service';
import { CreateCheckoutSession } from './inputs/create-checkout-session.input';
import { CheckoutSession } from './entities/checkoutSession.entity';
import { PaymentsService } from './payments.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDocument } from 'src/auth/entities/user.entity';

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly checkoutSessionService: CheckoutSessionService,
  ) {}

  @Mutation(() => CheckoutSession)
  createCheckoutSession(
    @Args('createCheckoutSession') createCheckoutSession: CreateCheckoutSession,
    @CurrentUser() user: UserDocument,
  ) {
    return this.paymentsService.createCheckoutSession(
      createCheckoutSession,
      user,
    );
  }

  @Query(() => CheckoutSession, { name: 'checkoutSession' })
  findOne(@CurrentUser() user: UserDocument, @Args('id') id: string) {
    return this.checkoutSessionService.findCurrentUsersOneByStripeId(id, user);
  }
}

import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Public } from 'src/common/decorators/public.decorator';
import { AppSubscriptionsService } from './app-subscriptions.service';
import { AppSubscription } from './entities/app-subscription.entity';
import { CreateAppSubscriptionInput } from './inputs/create-app-subscription.input';

@Resolver()
export class AppSubscriptionsResolver {
  constructor(
    private readonly appSubscriptionService: AppSubscriptionsService,
  ) {}

  @Public()
  @Mutation(() => AppSubscription)
  createAppSubscription(
    @Args('CreateAppSubscriptionInput')
    createAppSubscriptionInput: CreateAppSubscriptionInput,
  ) {
    return this.appSubscriptionService.create(createAppSubscriptionInput);
  }

  @Public()
  @Query(() => [AppSubscription], { name: 'appSubscriptions' })
  getAllAppSubscriptions() {
    return this.appSubscriptionService.findAll();
  }
}

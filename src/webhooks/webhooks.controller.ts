import {
  Controller,
  ForbiddenException,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Public()
  @Post()
  webhook(@Req() req: RawBodyRequest<Request>) {
    try {
      const payload = req.rawBody;
      const stripeSignature = req.headers['stripe-signature'] as string;
      this.webhooksService.fulfillMoviesPayment(stripeSignature, payload);
    } catch (err) {
      console.error(err);
      throw new ForbiddenException();
    }
  }
}

import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Request } from 'express';
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  webhook(@Req() req: RawBodyRequest<Request>) {
    try {
      const payload = req.rawBody;
      const stripeSignature = req.headers['stripe-signature'] as string;
      this.webhooksService.checkPaymentStatus(stripeSignature, payload);
    } catch (err) {
      console.error(err);
      throw new ForbiddenException();
    }
  }
}

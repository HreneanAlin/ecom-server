import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PUBLIC_ROUTERS_KEY } from '../helpers/constants';

@Injectable()
export class TokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }
  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_ROUTERS_KEY,
      [gqlContext.getHandler(), gqlContext.getClass()],
    );

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export const REQUEST_CONTEXT = '_requestContext';

@Injectable()
export class InjectUserInterceptor implements NestInterceptor {
  constructor(private type?: 'query' | 'body' | 'param') {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('hey');
    // const request = context.switchToHttp().getRequest();

    // if (this.type && request[this.type]) {
    //   request[this.type][REQUEST_CONTEXT] = {
    //     user: request.user,
    //   };
    // }

    return next.handle();
  }
}

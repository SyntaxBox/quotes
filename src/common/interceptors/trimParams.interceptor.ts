import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

// removes extra spaces from the request data
// request query| params| body
@Injectable()
export class TrimParamsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // checking each object if exists
    // assigning each object to the spaces removed version
    if (request.query) {
      request.query = this.trimObjectProperties(request.query);
    }
    if (request.params) {
      request.params = this.trimObjectProperties(request.params);
    }
    if (request.body) {
      request.body = this.trimObjectProperties(request.body);
    }
    return next.handle();
  }

  // operation is done only for string key values
  // trim each key value
  // remove extra spaces between the words sing regex
  // returns the trimmed version
  private trimObjectProperties(obj: object): object {
    const trimmedObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        trimmedObj[key] = value.trim().replace(/\s{2,}/g, ' ');
      } else {
        trimmedObj[key] = value;
      }
    }
    return trimmedObj;
  }
}

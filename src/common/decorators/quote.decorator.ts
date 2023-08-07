import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ParseBooleanPipe, QuoteFilter } from 'src/common';

const allowedQueryParams: QuoteFilter = {
  id: true,
  quote: true,
  author: true,
  userId: true,
  published: true,
  showUserInformation: true,
  createdAt: true,
  updatedAt: true,
};

export const QuoteQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const parsedQuery: QuoteFilter = {};

    for (const key in allowedQueryParams) {
      if (request.query.hasOwnProperty(key)) {
        const value = request.query[key];
        parsedQuery[key] = new ParseBooleanPipe().transform(value, {
          metatype: Boolean,
          type: 'query',
        });
      }
    }

    if (Object.keys(parsedQuery).length === 0) return undefined;
    return parsedQuery;
  },
);

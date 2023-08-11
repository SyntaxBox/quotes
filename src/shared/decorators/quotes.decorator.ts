import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ParseBooleanPipe, QuoteFilter } from 'src/shared';

// create an object of type QuoteFilter to loop through
const allowedQueryParams: QuoteFilter = {
  id: true,
  quote: true,
  author: true,
  userId: true,
  showUserInformation: true,
  createdAt: true,
  updatedAt: true,
};

// return the quoteQuery return object
export const QuoteQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // queries are stored here
    const parsedQuery: QuoteFilter = {};

    // looping throw to object created above to find only the matching queries
    for (const key in allowedQueryParams) {
      if (request.query.hasOwnProperty(key)) {
        const value = request.query[key];
        // parsing the query value from string to boolean using custom pipe
        parsedQuery[key] = new ParseBooleanPipe().transform(value, {
          metatype: Boolean,
          type: 'query',
        });
      }
    }

    // return undefined if there no quey found from the type UserFilter instead of empty object
    if (Object.keys(parsedQuery).length === 0) return undefined;
    return parsedQuery;
  },
);

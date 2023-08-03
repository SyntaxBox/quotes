import { Quote as PrismaQuote } from '@prisma/client';

export type Quote = PrismaQuote;

export type QuoteFilter = {
  [K in keyof Quote]?: boolean;
};

export type CreateQuote = {
  data: Pick<
    Quote,
    'quote' | 'author' | 'published' | 'showUserInformation' | 'userId'
  >;
  select: QuoteFilter;
};

import { Quote as PrismaQuote } from '@prisma/client';

type Quote = PrismaQuote;

export type QuoteFilter = {
  [K in keyof Quote]?: boolean;
};

export type Data = Pick<
  Quote,
  'quote' | 'author' | 'published' | 'showUserInformation' | 'userId'
>;

export type CreateQuote = {
  data: Data;
  select: QuoteFilter;
};

export type UpdateQuote = {
  where: Pick<Quote, 'id'>;
  data: Data;
  select: QuoteFilter;
};

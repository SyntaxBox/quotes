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

export type QuoteId = Pick<Quote, 'id'>;

export type UpdateQuote = {
  where: QuoteId;
  data: Partial<Data>;
  select: QuoteFilter;
};

export type FindUniqueQuote = {
  where: QuoteId;
  select: QuoteFilter;
};

export type DeleteQuote = {
  where: QuoteId;
  select: QuoteFilter;
};

export type RandomQuote = {
  select: QuoteFilter;
};

import { Quote as PrismaQuote } from '@prisma/client';
// dynamic quote type depends on the prisma client quote type
type Quote = PrismaQuote;

// transforming the Quote type to optional boolean values
export type QuoteFilter = {
  [K in keyof Quote]?: boolean;
};

// other types are can be understood from it's name

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

export type FindManyQuotes = {
  take: number;
  skip: number;
  where?: QuoteId;
  select: QuoteFilter;
};

export type DeleteQuote = {
  where: QuoteId;
  select: QuoteFilter;
};

export type RandomQuote = {
  select: QuoteFilter;
};

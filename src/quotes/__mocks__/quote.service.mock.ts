import { Quote } from '@prisma/client';
import {
  CreateQuote,
  DeleteQuote,
  FindManyQuotes,
  FindUniqueQuote,
  ObjectUtils,
  RandomQuote,
  UpdateQuote,
} from 'src/shared';

const objectUtils = new ObjectUtils();

const defaultValues: Quote = {
  id: 'defaultId',
  author: 'abdelhamid boudjit',
  createdAt: new Date('2023-08-13T10:56:26.095Z'),
  updatedAt: new Date('2023-08-13T10:56:26.095Z'),
  quote: 'i love typescript',
  showUserInformation: true,
  userId: 'someID',
};

export const QuotesServiceMock = {
  findRandom: jest.fn(({ select }: RandomQuote): Promise<Partial<Quote>> => {
    const randomQuote = defaultValues;
    return new Promise((resolve) => {
      resolve(objectUtils.selectKeys(randomQuote, select));
    });
  }),

  findUnique: jest.fn(
    ({ where, select }: FindUniqueQuote): Promise<Partial<Quote>> => {
      const uniqueQuote: Quote = { ...defaultValues, ...where };
      return new Promise((resolve) => {
        resolve(objectUtils.selectKeys(uniqueQuote, select));
      });
    },
  ),

  findMany: jest.fn(
    ({
      take,
      skip,
      where,
      select,
    }: FindManyQuotes): Promise<Partial<Quote>[]> => {
      const quote = objectUtils.selectKeys(
        { ...defaultValues, ...where },
        select,
      );
      const quotes = [];
      for (let i = 0; i < take; i++) {
        quotes.push(quote);
      }
      return new Promise((resolve) => {
        resolve(quotes);
      });
    },
  ),

  create: jest.fn(({ data, select }: CreateQuote): Promise<Partial<Quote>> => {
    const createdQuote: Quote = { ...defaultValues, ...data };
    return new Promise((resolve) => {
      resolve(objectUtils.selectKeys(createdQuote, select));
    });
  }),

  update: jest.fn(
    ({ where, data, select }: UpdateQuote): Promise<Partial<Quote>> => {
      const createdQuote: Quote = {
        ...defaultValues,
        ...where,
        ...data,
      };
      return new Promise((resolve) => {
        resolve(objectUtils.selectKeys(createdQuote, select));
      });
    },
  ),

  delete: jest.fn(({ select, where }: DeleteQuote): Promise<Partial<Quote>> => {
    const createdQuote: Quote = { ...defaultValues, ...where };
    return new Promise((resolve) => {
      resolve(objectUtils.selectKeys(createdQuote, select));
    });
  }),
};

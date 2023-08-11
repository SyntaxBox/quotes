import { Test, TestingModule } from '@nestjs/testing';
import { QuotesController } from '../quotes.controller';
import { QuotesService } from '../quotes.service';
import { QuotesServiceMock } from '../__mocks__/quote.service.mock';
import { Quote } from '@prisma/client';
import { AddQuoteDTO, UpdateQuoteDTO } from 'src/shared';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UnauthorizedException } from '@nestjs/common';

describe('QuotesController', () => {
  let quotesController: QuotesController;
  let quotesService: QuotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule, AuthModule],
      controllers: [QuotesController],
      providers: [
        {
          provide: QuotesService,
          useValue: QuotesServiceMock,
        },
      ],
    }).compile();

    quotesController = module.get<QuotesController>(QuotesController);
    quotesService = module.get<QuotesService>(QuotesService);
  });

  describe('add', () => {
    const mockUser = { id: 'user_id' };
    const addQuoteDto: AddQuoteDTO = {
      quote: 'i hate testing',
      author: 'abdelhamid',
      showUserInformation: false,
    };

    const req = { user: mockUser };

    it('should create a new quote', async () => {
      const result = await quotesController.addQuote(addQuoteDto, req, {
        id: true,
      });

      const expectedResult: Partial<Quote> = {
        id: 'defaultId',
      };
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if the there is no user id', async () => {
      const req = undefined;

      await expect(
        quotesController.addQuote(addQuoteDto, req, {
          id: true,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('update', () => {
    const id = 'someQuoteId';
    const updateQuoteDto: UpdateQuoteDTO = {
      author: 'abdelhamid',
      quote: 'new quote',
    };
    const select = {
      id: true,
      author: true,
      quote: true,
    };

    it('should update a quote', async () => {
      const result = await quotesController.updateQuote(
        id,
        updateQuoteDto,
        select,
      );

      const expectedResult: Partial<Quote> = {
        id,
        author: updateQuoteDto.author,
        quote: 'new quote',
      };
      expect(result).toEqual(expectedResult);
    });

    it('should update a quote and return quote item', async () => {
      const result = await quotesController.updateQuote(id, updateQuoteDto);

      const expectedResult: Partial<Quote> = {
        quote: 'new quote',
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    const id = 'someQuoteId';
    const select = {
      id: true,
      author: true,
      quote: true,
    };

    it('should delete a quote', async () => {
      const result = await quotesController.deleteQuote(id, select);

      const expectedResult: Partial<Quote> = {
        id,
        author: expect.any(String),
        quote: expect.any(String),
      };
      expect(result).toEqual(expectedResult);
    });

    it('should delete a quote and return quote item', async () => {
      const result = await quotesController.deleteQuote(id);

      const expectedResult: Partial<Quote> = {
        quote: expect.any(String),
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('get random', () => {
    const select = {
      id: true,
      author: true,
      quote: true,
    };

    it('should return a random quote', async () => {
      const result = await quotesController.getRandomQuote(select);

      const expectedResult: Partial<Quote> = {
        id: expect.any(String),
        author: expect.any(String),
        quote: expect.any(String),
      };
      expect(result).toEqual(expectedResult);
    });

    it('should get a random quote and return quote item', async () => {
      const result = await quotesController.getRandomQuote();

      const expectedResult: Partial<Quote> = {
        quote: expect.any(String),
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('get single', () => {
    const id = 'someQuoteId';
    const select = {
      id: true,
      author: true,
      quote: true,
    };

    it('should get a quote', async () => {
      const result = await quotesController.getQuote(id, select);

      const expectedResult: Partial<Quote> = {
        id,
        author: expect.any(String),
        quote: expect.any(String),
      };
      expect(result).toEqual(expectedResult);
    });

    it('should get a quote and return quote item', async () => {
      const result = await quotesController.getQuote(id);

      const expectedResult: Partial<Quote> = {
        quote: expect.any(String),
      };
      expect(result).toEqual(expectedResult);
    });
  });
  describe('get many', () => {
    const select = {
      id: true,
      author: true,
      quote: true,
    };

    it('should get a list of quote with 2 objects', async () => {
      const result = await quotesController.getQuotes(select, '2', '0');

      const expectedResult: { quotes: Partial<Quote>[] } = {
        quotes: [
          {
            id: expect.any(String),
            author: expect.any(String),
            quote: expect.any(String),
          },
          {
            id: expect.any(String),
            author: expect.any(String),
            quote: expect.any(String),
          },
        ],
      };
      expect(result).toEqual(expectedResult);
    });

    it('should get a list of quotes with 10 objects', async () => {
      const result = await quotesController.getQuotes(select);
      expect(result.quotes).toHaveLength(10);
    });

    it('should get a list of quotes with one object', async () => {
      const result = await quotesController.getQuotes(undefined, '1');
      const expectedResult: { quotes: Partial<Quote>[] } = {
        quotes: [
          {
            quote: expect.any(String),
          },
        ],
      };
      expect(result).toEqual(expectedResult);
    });
  });
});

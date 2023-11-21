import { Test, TestingModule } from '@nestjs/testing';
import { QuotesService } from '../quotes.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateQuote,
  FindUniqueQuote,
  FindManyQuotes,
  UpdateQuote,
} from 'src/shared';
import { NotFoundException, HttpException } from '@nestjs/common';
import { Quote } from '@prisma/client';

describe('QuotesService', () => {
  let quotesService: QuotesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotesService, PrismaService],
    }).compile();

    quotesService = module.get<QuotesService>(QuotesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(quotesService).toBeDefined();
  });

  const data = {
    userId: 'someId',
    author: 'abdelhamid',
    quote: 'I hate testing',
    showUserInformation: true,
  };

  //expect to return
  const select = {
    id: true,
  };

  const createdAt = new Date();
  const updatedAt = new Date();

  const where: FindUniqueQuote['where'] = {
    id: 'someId',
  };
  const returnedValue: Quote = {
    ...where,
    ...data,
    createdAt,
    updatedAt,
  };

  describe('create', () => {
    const createQuote: CreateQuote = {
      data,
      select,
    };

    it('should create a new quote', async () => {
      const prismaQuoteCreateSpy = jest
        .spyOn(prismaService.quote, 'create')
        .mockResolvedValue({
          id: 'someId',
          ...createQuote.data,
          createdAt,
          updatedAt,
        });

      const quote = await quotesService.create(createQuote);

      expect(quote).toEqual(returnedValue);
      expect(prismaQuoteCreateSpy).toHaveBeenCalledWith(createQuote);
    });

    it('should throw an HttpException if quote creation fails', async () => {
      jest.spyOn(prismaService.quote, 'create').mockRejectedValue(new Error());

      await expect(quotesService.create(createQuote)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findRandom', () => {
    // it('should find a random quote', async () => {
    //   const quotes = [
    //     {
    //       id: 'someId',
    //       ...data,
    //       createdAt,
    //       updatedAt,
    //     },
    //     {
    //       id: 'someId',
    //       ...data,
    //       createdAt,
    //       updatedAt,
    //     },
    //   ];
    //   const prismaQuoteFindManySpy = jest
    //     .spyOn(prismaService.quote, 'findMany')
    //     .mockResolvedValue(quotes);
    //   const result = await quotesService.findRandom({ select });
    //   // expect(result).toEqual({ ...returnedValue, ...quotes[0] });
    //   expect(prismaQuoteFindManySpy).toHaveBeenCalledWith({
    //     skip: expect.any(Number),
    //     take: 1,
    //     select: { id: true, ...select },
    //   });
    // });
  });

  describe('findUnique', () => {
    const quote = {
      id: 'someId',
    };

    it('should find a unique quote', async () => {
      const prismaQuoteFindUniqueSpy = jest
        .spyOn(prismaService.quote, 'findUnique')
        .mockResolvedValue({
          ...quote,
          ...data,
          createdAt,
          updatedAt,
        });

      const result = await quotesService.findUnique({ where, select });

      expect(result).toEqual({ ...returnedValue, ...quote });
      expect(prismaQuoteFindUniqueSpy).toHaveBeenCalledWith({
        where,
        select: { id: true },
      });
    });

    it('should throw a NotFoundException if quote is not found', async () => {
      jest.spyOn(prismaService.quote, 'findUnique').mockResolvedValue(null);

      await expect(quotesService.findUnique({ where, select })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findMany', () => {
    it('should find many quotes', async () => {
      const take: FindManyQuotes['take'] = 2;
      const skip: FindManyQuotes['skip'] = 0;
      const quotes = [
        {
          id: 'someId',
          ...data,
          createdAt,
          updatedAt,
        },
        {
          id: 'someId',
          ...data,
          createdAt,
          updatedAt,
        },
      ];

      const prismaQuoteFindManySpy = jest
        .spyOn(prismaService.quote, 'findMany')
        .mockResolvedValue(quotes);

      const result = await quotesService.findMany({
        take,
        skip,
        select,
      });

      expect(result).toEqual(quotes);
      expect(prismaQuoteFindManySpy).toHaveBeenCalledWith({
        take,
        skip,
        select,
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should throw a NotFoundException if no quotes are found', async () => {
      const take: FindManyQuotes['take'] = 10;
      const skip: FindManyQuotes['skip'] = 0;

      jest.spyOn(prismaService.quote, 'findMany').mockResolvedValue([]);

      await expect(
        quotesService.findMany({ take, skip, select }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateData: UpdateQuote['data'] = {
      author: 'abdelhamid',
      quote: 'I hate testing',
    };

    it('should update a quote', async () => {
      const prismaQuoteUpdateSpy = jest
        .spyOn(prismaService.quote, 'update')
        .mockResolvedValue({
          id: 'someId',
          ...data,
          ...updateData,
          createdAt,
          updatedAt,
        });

      const updatedQuote = await quotesService.update({ where, data, select });

      expect(updatedQuote).toEqual({ ...updateData, ...returnedValue });
      expect(prismaQuoteUpdateSpy).toHaveBeenCalledWith({
        where,
        data,
        select: { id: true },
      });
    });

    it('should throw an HttpException if quote update fails', async () => {
      jest.spyOn(prismaService.quote, 'update').mockRejectedValue(new Error());

      await expect(
        quotesService.update({ where, data, select }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('delete', () => {
    it('should delete a quote', async () => {
      const prismaQuoteDeleteSpy = jest
        .spyOn(prismaService.quote, 'delete')
        .mockResolvedValue({
          id: 'someId',
          ...data,
          updatedAt,
          createdAt,
        });

      const deletedQuote = await quotesService.delete({ where, select });

      expect(deletedQuote).toEqual(returnedValue);
      expect(prismaQuoteDeleteSpy).toHaveBeenCalledWith({
        where,
        select: { id: true },
      });
    });

    it('should throw an HttpException if quote deletion fails', async () => {
      jest.spyOn(prismaService.quote, 'delete').mockRejectedValue(new Error());

      await expect(quotesService.delete({ where, select })).rejects.toThrow(
        HttpException,
      );
    });
  });
});

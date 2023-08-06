import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class AddQuoteDTO {
  @IsString()
  @MinLength(10)
  quote: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  author: string;

  @IsBoolean()
  @IsNotEmpty()
  published: boolean;

  @IsBoolean()
  @IsNotEmpty()
  showUserInformation: boolean;
}

export class UpdateQuoteDTO {
  @IsOptional()
  @IsString()
  @MinLength(10)
  quote: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  author: string;

  @IsOptional()
  @IsBoolean()
  published: boolean;

  @IsBoolean()
  @IsOptional()
  showUserInformation: boolean;
}

export class QueryParamsDTO {
  @IsBoolean()
  @IsOptional()
  quote: boolean;

  @IsBoolean()
  @IsOptional()
  showUserInformation: boolean;

  @IsBoolean()
  @IsOptional()
  author: boolean;

  @IsBoolean()
  @IsOptional()
  published: boolean;

  @IsBoolean()
  @IsOptional()
  createdAt: boolean;

  @IsBoolean()
  @IsOptional()
  updateAt: boolean;
}
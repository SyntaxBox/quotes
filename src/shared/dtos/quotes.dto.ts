import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// new quote required data
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
  showUserInformation: boolean;
}

// quote update required data
export class UpdateQuoteDTO {
  @IsOptional()
  @IsString()
  @MinLength(10)
  quote?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  author?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsBoolean()
  @IsOptional()
  showUserInformation?: boolean;
}

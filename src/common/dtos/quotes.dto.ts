import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AddQuoteDTO {
  @IsString()
  @MinLength(10)
  quote: string;

  @IsString()
  @MinLength(8)
  author: string;

  @IsBoolean()
  published: boolean;

  @IsBoolean()
  showUserInformation: boolean;
}

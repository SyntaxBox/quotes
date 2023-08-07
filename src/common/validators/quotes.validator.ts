import { IsBoolean, IsOptional } from 'class-validator';

export class QueryParams {
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

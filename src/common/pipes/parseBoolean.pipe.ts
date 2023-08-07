import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ParseBooleanPipe implements PipeTransform<any, any> {
  transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!value || value === 'false' || value !== 'true') value = '';
    if (!metatype || !this.toBoolean(metatype)) return value;

    const object = plainToClass(metatype, value);
    const errors = validateSync(object);

    if (errors.length > 0) throw new BadRequestException('Validation failed');

    return object;
  }

  private toBoolean(metatype: any): boolean {
    return metatype === Boolean;
  }
}

import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

// transforming pipe
// transform the string to boolean
// accepted values are 'true' | 'false'
// for other values will be set to empty string ''
// transform the 'true' & 'false' strings to boolean value
@Injectable()
export class ParseBooleanPipe implements PipeTransform<any, any> {
  transform(value: any, metadata: ArgumentMetadata) {
    // extracting metatype from the metadata
    const { metatype } = metadata;

    // checking if the value is not either 'true' | 'false' | falsy value
    // setting it to empty string ''
    if (!value || value === 'false' || value !== 'true') value = '';
    // if the metatype is undefined to is not of type Boolean will return the value without any change
    if (!metatype || !this.toBoolean(metatype)) return value;
    // transforming the value
    const object = plainToClass(metatype, value);
    // collecting errors
    const errors = validateSync(object);

    // if there is ant error will throw an exception
    if (errors.length > 0) throw new BadRequestException('Validation failed');

    // return the transformed object
    return object;
  }

  // checks if the metatype is of type Boolean
  private toBoolean(metatype: any): boolean {
    return metatype === Boolean;
  }
}

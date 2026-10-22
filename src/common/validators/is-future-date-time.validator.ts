import { registerDecorator, ValidationOptions } from 'class-validator';
import { parseIsoDateTime } from '../utils/date.utils';

/**
 * Checks that an ISO 8601 date-time string points to a moment in the future.
 * Unparseable values are left to @IsISO8601, so only one cause is reported for them.
 */
export function IsFutureDateTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDateTime',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} має бути в майбутньому`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') {
            return true;
          }
          const date = parseIsoDateTime(value);
          return date === null || date.getTime() > Date.now();
        },
      },
    });
  };
}

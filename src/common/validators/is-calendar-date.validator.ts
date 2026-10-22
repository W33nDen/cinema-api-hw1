import { registerDecorator, ValidationOptions } from 'class-validator';
import { isCalendarDate } from '../utils/date.utils';

/**
 * Checks that a YYYY-MM-DD string is an existing calendar day (2030-02-30 is not).
 * The format itself is checked by @Matches, so a wrong format is reported once.
 */
export function IsCalendarDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCalendarDate',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must be an existing calendar date`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return true;
          }
          return isCalendarDate(value);
        },
      },
    });
  };
}

import { BadRequestException, ValidationError } from '@nestjs/common';

/**
 * Turns class-validator errors into a 400 whose `message` is a flat array of
 * Ukrainian strings. Nested fields get their full path (seats.0.row), and the
 * built-in English "property X should not exist" (forbidNonWhitelisted) is
 * replaced with a Ukrainian text.
 */
export function validationExceptionFactory(
  errors: ValidationError[],
): BadRequestException {
  return new BadRequestException(flatten(errors));
}

function flatten(errors: ValidationError[], parentPath = ''): string[] {
  return errors.flatMap((error) => {
    const path = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    const own = Object.entries(error.constraints ?? {}).map(([name, text]) =>
      name === 'whitelistValidation'
        ? `Поле ${path} не передбачене для цього запиту`
        : text.replace(error.property, path),
    );
    return [...own, ...flatten(error.children ?? [], path)];
  });
}

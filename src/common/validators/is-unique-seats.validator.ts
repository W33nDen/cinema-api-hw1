import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

type SeatLike = { row?: unknown; seat?: unknown };

function findDuplicateSeat(value: unknown): string | null {
  if (!Array.isArray(value)) {
    return null;
  }
  const seen = new Set<string>();
  for (const item of value as unknown[]) {
    if (typeof item !== 'object' || item === null) {
      continue;
    }
    const { row, seat } = item as SeatLike;
    const key = `row ${String(row)}, seat ${String(seat)}`;
    if (seen.has(key)) {
      return key;
    }
    seen.add(key);
  }
  return null;
}

/** Checks that an array of {row, seat} contains each seat only once. */
export function IsUniqueSeats(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUniqueSeats',
      target: object.constructor,
      propertyName,
      options: {
        message: (args: ValidationArguments) =>
          `${args.property} must not contain the same seat twice (${findDuplicateSeat(args.value) ?? ''})`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          return findDuplicateSeat(value) === null;
        },
      },
    });
  };
}

import { plainToInstance } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT?: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

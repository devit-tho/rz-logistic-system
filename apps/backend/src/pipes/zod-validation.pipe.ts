import { BadRequestException, PipeTransform } from '@nestjs/common';
import z, { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType<any>) {}

  transform(value: any) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const formatted = z.flattenError(result.error);

      throw new BadRequestException(formatted);
    }

    return result.data;
  }
}

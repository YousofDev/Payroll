import type { Request } from "express";
import { AnyZodObject, ZodError, z } from "zod";
import { BadRequestException } from "@exception/BadRequestException";

export async function validate<T extends AnyZodObject>(
  dto: T,
  req: Request
): Promise<z.infer<T>> {
  try {
    return dto.parseAsync(req);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new BadRequestException(error.message);
    }

    return new BadRequestException(JSON.stringify(error));
  }
}

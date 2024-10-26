import { z } from "zod";

export const AdditionTypeIdRequestDto = z.object({
  params: z.object({
    additionTypeId: z
      .string({
        required_error: "Addition type id is required",
      })
      .transform((additionTypeId) => parseInt(additionTypeId)),
  }),
});

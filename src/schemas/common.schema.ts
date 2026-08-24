import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce.number().int().positive("정수 형태의 id 값이 아닙니다"),
});

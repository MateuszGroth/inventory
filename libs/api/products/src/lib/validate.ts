import { ProductCategory } from '@org/db'
import z from 'zod'

const paginateQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      const numberValue = Number(val)
      if (!numberValue || isNaN(numberValue)) {
        return 1
      }

      return numberValue
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const numberValue = Number(val)
      if (!numberValue || isNaN(numberValue)) {
        return
      }

      return numberValue
    }),
})

export const getProductsQueryParamsSchema = paginateQuerySchema.extend({
  name: z.string().optional(),
  category: z.enum(ProductCategory).optional(),
  orderBy: z.literal(['name', 'category']).optional(),
  orderDir: z.literal(['asc', 'desc']).optional(),
})

export type GetProductsParams = z.infer<typeof getProductsQueryParamsSchema>

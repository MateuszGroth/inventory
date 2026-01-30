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

export const getStoresQueryParamsSchema = paginateQuerySchema.extend({
  name: z.string().optional(),
  location: z.string().optional(),
  orderBy: z.literal(['name', 'location']).optional(),
  orderDir: z.literal(['asc', 'desc']).optional(),
})

export type GetStoresFilters = z.infer<typeof getStoresQueryParamsSchema>

export const createStorePayloadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(64),
  location: z.string().min(1, 'Location is required').max(64),
})

export type CreateStorePayload = z.infer<typeof createStorePayloadSchema>

export const transferStoreProductsPayloadSchema = z.object({
  destinationStoreId: z.uuid('destinationStoreId must be a valid UUID'),
})

export type TransferStoreProductsPayload = z.infer<typeof transferStoreProductsPayloadSchema>

export const getStoreProductsQueryParamsSchema = paginateQuerySchema.extend({
  name: z.string().optional(),
  category: z.enum(ProductCategory).optional(),
  orderBy: z.literal(['name', 'category', 'price', 'quantity']).optional(),
  orderDir: z.literal(['asc', 'desc']).optional(),
})

export type GetStoreProductsParams = z.infer<typeof getStoreProductsQueryParamsSchema>

export const createStoreProductPayloadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(128),
  category: z.enum(ProductCategory, { message: 'Invalid category' }),
  quantity: z.number().int().positive('Must be higher than 0'),
  price: z.number().int().positive('Price must be a higher than 0 (in cents)'),
})

export type CreateStoreProductPayload = z.infer<typeof createStoreProductPayloadSchema>

export const updateStoreProductPayloadSchema = z.object({
  quantity: z.number().int().positive('Must be higher than 0'),
  price: z.number().int().positive('Price must be a higher than 0 (in cents)'),
})

export type UpdateStoreProductPayload = z.infer<typeof updateStoreProductPayloadSchema>

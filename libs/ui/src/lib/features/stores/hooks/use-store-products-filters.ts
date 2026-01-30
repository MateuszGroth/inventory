import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { GetStoreProductsParams } from '../services/stores'

const zodNumberFieldOptional = z
  .string()
  .nullish()
  .or(z.number())
  .transform((val) => {
    if (val == null || val === '' || isNaN(Number(val))) {
      return undefined
    }

    return Number(val)
  })
  .optional()
  .default(1)

const filtersSchema = z.object({
  page: zodNumberFieldOptional,
  name: z.string().optional(),
  category: z.string().optional(),
  orderBy: z.literal(['name', 'category']).optional(),
  orderDir: z.literal(['asc', 'desc']).optional(),
})

export const useStoreProductsFilters = () => {
  const [params, setSearchParams] = useSearchParams()
  const parsedParams = useMemo(() => {
    const parseResult = filtersSchema.safeParse(Object.fromEntries(params.entries()))
    if (!parseResult.success) {
      return
    }

    return parseResult.data
  }, [params])

  const changeFilters = (filters: Partial<GetStoreProductsParams>) => {
    setSearchParams((current) => {
      const paramsCopy = new URLSearchParams(current)
      for (const key in filters) {
        const value = filters[key as keyof GetStoreProductsParams]
        if (value == null) {
          paramsCopy.delete(key)
        } else {
          paramsCopy.set(key, String(value))
        }
      }

      return paramsCopy
    })
  }

  return { filters: parsedParams, changeFilters }
}

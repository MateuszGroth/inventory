import { ApiResponse, GetProductsResponse } from '@org/models'
import { fetchJson } from '../../../utils/fetch-json'

export type GetProductsParams = {
  page: number
  limit?: number
  name?: string
  category?: string
  orderBy?: 'name' | 'category' | 'createdAt'
  orderDir?: 'asc' | 'desc'
}

const parseGetProductsParams = (params?: GetProductsParams): Record<keyof GetProductsParams, string> => {
  const parsedArg: Record<string, string> = {}

  for (const key in params) {
    const value = params[key as keyof GetProductsParams]
    if (value == null) {
      continue
    }

    if ((typeof value === 'string' || Array.isArray(value)) && value.length === 0) {
      continue
    }

    const parsedValue = Array.isArray(value) ? value.join(',') : String(value)
    parsedArg[key] = parsedValue
  }

  return parsedArg as Record<keyof GetProductsParams, string>
}

export const getProducts = async (params?: GetProductsParams) => {
  const searchParams = new URLSearchParams(parseGetProductsParams(params))
  const search = `?${searchParams.toString()}`

  const response = await fetchJson<ApiResponse<GetProductsResponse>>(`/products${search}`)
  if (!response) {
    throw new Error('Invalid Products Response')
  }

  return response
}

export const deleteProduct = async (id: string) => {
  await fetchJson<ApiResponse<null>>(`/products/${id}`, { method: 'DELETE' })
}

export const getCategories = async () => {
  const response = await fetchJson<ApiResponse<string[]>>('/products/categories')
  if (!response) {
    throw new Error('Invalid Categories Response')
  }

  return response
}

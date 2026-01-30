import {
  ApiResponse,
  CreateStoreProductResponse,
  CreateStoreResponse,
  GetStoreProductsResponse,
  GetStoreResponse,
  GetStoresResponse,
  ProductCategory,
  StoreExternal,
  StoreProductExternal,
  UpdateStoreProductResponse,
} from '@org/models'
import { fetchJson } from '../../../utils/fetch-json'

export type GetStoresParams = {
  page: number
  limit?: number
  name?: string
  location?: string
  orderBy?: 'name' | 'location'
  orderDir?: 'asc' | 'desc'
}

const parseGetStoresParams = (params?: GetStoresParams): Record<keyof GetStoresParams, string> => {
  const parsedArg: Record<string, string> = {}

  for (const key in params) {
    const value = params[key as keyof GetStoresParams]
    if (value == null) {
      continue
    }

    if ((typeof value === 'string' || Array.isArray(value)) && value.length === 0) {
      continue
    }

    const parsedValue = Array.isArray(value) ? value.join(',') : String(value)
    parsedArg[key] = parsedValue
  }

  return parsedArg as Record<keyof GetStoresParams, string>
}

export const getStores = async (params?: GetStoresParams) => {
  const searchParams = new URLSearchParams(parseGetStoresParams(params))
  const search = `?${searchParams.toString()}`

  const response = await fetchJson<ApiResponse<GetStoresResponse>>(`/stores${search}`)
  if (!response) {
    throw new Error('Invalid Stores Response')
  }

  return response
}

export const getStore = async (id: string) => {
  const response = await fetchJson<ApiResponse<GetStoreResponse>>(`/stores/${id}`)
  if (!response) {
    throw new Error('Invalid Store Response')
  }

  return response
}

export const deleteStore = async (id: string) => {
  await fetchJson<ApiResponse<null>>(`/stores/${id}`, { method: 'DELETE' })
}

export type CreateStorePayload = Pick<StoreExternal, 'name' | 'location'>

export const createStore = async (payload: CreateStorePayload) => {
  await fetchJson<ApiResponse<CreateStoreResponse>, CreateStorePayload>(`/stores`, {
    method: 'POST',
    body: payload,
  })
}

export type UpdateStorePayload = Pick<StoreExternal, 'name' | 'location'>

export const updateStore = async ({ id, payload }: { id: string; payload: UpdateStorePayload }) => {
  await fetchJson<ApiResponse<CreateStoreResponse>, CreateStorePayload>(`/stores/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

export type CreateStoreProductPayload = { price: number; quantity: number; name: string; category: ProductCategory }

export const createStoreProduct = async ({
  storeId,
  payload,
}: {
  storeId: string
  payload: CreateStoreProductPayload
}) => {
  return await fetchJson<ApiResponse<CreateStoreProductResponse>, CreateStoreProductPayload>(
    `/stores/${storeId}/products`,
    {
      method: 'POST',
      body: payload,
    }
  )
}

export type UpdateStoreProductPayload = Pick<CreateStoreProductPayload, 'quantity' | 'price'>

export const updateStoreProduct = async ({
  id,
  storeId,
  payload,
}: {
  id: string
  storeId: string
  payload: UpdateStoreProductPayload
}) => {
  return await fetchJson<ApiResponse<UpdateStoreProductResponse>, UpdateStoreProductPayload>(
    `/stores/${storeId}/products/${id}`,
    {
      method: 'PUT',
      body: payload,
    }
  )
}

export const deleteStoreProduct = async ({ id, storeId }: { id: string; storeId: string }) => {
  await fetchJson<ApiResponse<void>>(`/stores/${storeId}/products/${id}`, {
    method: 'DELETE',
  })
}

export type TransferStoreProductsPayload = { destinationStoreId: string }

export const transferStoreProducts = async ({
  storeId,
  payload,
}: {
  storeId: string
  payload: TransferStoreProductsPayload
}) => {
  await fetchJson<ApiResponse<void>, TransferStoreProductsPayload>(`/stores/${storeId}/transfer`, {
    method: 'POST',
    body: payload,
  })
}

export type GetStoreProductsParams = {
  page: number
  limit?: number
  name?: string
  category?: string
  orderBy?: 'name' | 'category'
  orderDir?: 'asc' | 'desc'
}

const parseStoreGetProductsParams = (params?: GetStoreProductsParams): Record<keyof GetStoreProductsParams, string> => {
  const parsedArg: Record<string, string> = {}

  for (const key in params) {
    const value = params[key as keyof GetStoreProductsParams]
    if (value == null) {
      continue
    }

    if ((typeof value === 'string' || Array.isArray(value)) && value.length === 0) {
      continue
    }

    const parsedValue = Array.isArray(value) ? value.join(',') : String(value)
    parsedArg[key] = parsedValue
  }

  return parsedArg as Record<keyof GetStoreProductsParams, string>
}

export const getStoreProducts = async ({ storeId, params }: { storeId: string; params?: GetStoreProductsParams }) => {
  const searchParams = new URLSearchParams(parseStoreGetProductsParams(params))
  const search = `?${searchParams.toString()}`

  const response = await fetchJson<ApiResponse<GetStoreProductsResponse>>(`/stores/${storeId}/products${search}`)
  if (!response) {
    throw new Error('Invalid Store Products Response')
  }

  return response
}

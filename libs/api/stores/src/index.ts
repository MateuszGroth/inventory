import { Router } from 'express'
import {
  createStorePayloadSchema,
  createStoreProductPayloadSchema,
  getStoreProductsQueryParamsSchema,
  getStoresQueryParamsSchema,
  transferStoreProductsPayloadSchema,
  updateStoreProductPayloadSchema,
} from './lib/validate'
import { prisma } from '@org/db'
import { StoresService } from './lib/stores.service'
import { StoreProductsService } from './lib/store-products.service'
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  ApiResponse,
  CreateStoreProductResponse,
  CreateStoreResponse,
  GetStoreProductsResponse,
  GetStoreResponse,
  GetStoresResponse,
  UpdateStoreProductResponse,
  UpdateStoreResponse,
} from '@org/models'
import { $ZodIssue } from 'zod/v4/core'
import { NotFoundError } from './lib/errors'

const storesRouter: Router = Router()
const storesService = new StoresService(prisma)
const storeProductsService = new StoreProductsService(prisma)

storesRouter.get('/', async (req, res) => {
  const result = getStoresQueryParamsSchema.safeParse(req.query)
  if (!result.success) {
    const response: ApiResponse<$ZodIssue[]> = {
      data: result.error.issues,
      success: false,
      error: 'Validation failed',
    }
    return res.status(422).json(response)
  }

  try {
    const params = result.data
    const getStoresResponse = await storesService.getStores(params)
    const response: ApiResponse<GetStoresResponse> = {
      data: getStoresResponse,
      success: true,
    }
    return res.json(response)
  } catch (err) {
    const error = err as Error
    const response: ApiResponse<unknown> = {
      data: null,
      success: false,
      error: error.message,
    }
    return res.status(500).json(response)
  }
})

storesRouter.post('/', async (req, res) => {
  const result = createStorePayloadSchema.safeParse(req.body)
  if (!result.success) {
    const response: ApiResponse<$ZodIssue[]> = {
      data: result.error.issues,
      success: false,
      error: 'Validation failed',
    }
    return res.status(422).json(response)
  }

  try {
    const payload = result.data
    const createStoreResponse = await storesService.createStore(payload)
    const response: ApiResponse<CreateStoreResponse> = {
      data: createStoreResponse,
      success: true,
    }
    return res.status(201).json(response)
  } catch (err) {
    const error = err as Error
    const response: ApiResponse<unknown> = {
      data: null,
      success: false,
      error: error.message,
    }
    return res.status(500).json(response)
  }
})

storesRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const store = await storesService.getStore(id)
    const response: ApiResponse<GetStoreResponse> = {
      data: store,
      success: true,
    }
    return res.json(response)
  } catch (err) {
    const error = err as Error
    const response: ApiResponse<unknown> = {
      data: null,
      success: false,
      error: error.message,
    }
    const status = err && err instanceof NotFoundError ? 404 : 500
    return res.status(status).json(response)
  }
})

storesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await storesService.deleteStore(id)

    return res.status(204).send()
  } catch (err) {
    const error = err as Error
    const response: ApiResponse<unknown> = {
      data: null,
      success: false,
      error: error.message,
    }
    return res.status(500).json(response)
  }
})

storesRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const result = createStorePayloadSchema.safeParse(req.body)
  if (!result.success) {
    const response: ApiResponse<$ZodIssue[]> = {
      data: result.error.issues,
      success: false,
      error: 'Validation failed',
    }
    return res.status(422).json(response)
  }

  try {
    const payload = result.data
    const updateStoreResponse = await storesService.updateStore(id, payload)
    const response: ApiResponse<UpdateStoreResponse> = {
      data: updateStoreResponse,
      success: true,
    }
    return res.status(200).json(response)
  } catch (err) {
    const error = err as Error
    const response: ApiResponse<unknown> = {
      data: null,
      success: false,
      error: error.message,
    }
    const status = err && err instanceof NotFoundError ? 404 : 500
    return res.status(status).json(response)
  }
})

storesRouter.post('/:id/transfer', async (req, res) => {
  const result = transferStoreProductsPayloadSchema.safeParse(req.body)
  if (!result.success) {
    const response: ApiResponse<$ZodIssue[]> = {
      data: result.error.issues,
      success: false,
      error: 'Validation failed',
    }
    return res.status(422).json(response)
  }

  try {
    const { id } = req.params
    const payload = result.data
    await storesService.transferStoreProducts({ storeFromId: id, storeToId: payload.destinationStoreId })
    const response: ApiResponse<unknown> = {
      data: null,
      success: true,
    }
    return res.json(response)
  } catch (err) {
    const error = err as Error
    const response: ApiResponse<unknown> = {
      data: null,
      success: false,
      error: error.message,
    }
    const status = err && err instanceof NotFoundError ? 404 : 500
    return res.status(status).json(response)
  }
})

storesRouter.get('/:id/products', async (req, res) => {
  const { id } = req.params
  const result = getStoreProductsQueryParamsSchema.safeParse(req.query)
  if (!result.success) {
    const response: ApiResponse<$ZodIssue[]> = {
      data: result.error.issues,
      success: false,
      error: 'Validation failed',
    }
    return res.status(422).json(response)
  }

  try {
    const params = result.data
    const getStoreProductsResponse = await storeProductsService.getStoreProducts(id, params)
    const response: ApiResponse<GetStoreProductsResponse> = {
      data: getStoreProductsResponse,
      success: true,
    }
    return res.json(response)
  } catch (err) {
    const error = err as Error
    const response: ApiResponse<unknown> = {
      data: null,
      success: false,
      error: error.message,
    }
    const status = err && err instanceof NotFoundError ? 404 : 500
    return res.status(status).json(response)
  }
})

storesRouter.post('/:id/products', async (req, res) => {
  const { id } = req.params
  const result = createStoreProductPayloadSchema.safeParse(req.body)
  if (!result.success) {
    const response: ApiResponse<$ZodIssue[]> = {
      data: result.error.issues,
      success: false,
      error: 'Validation failed',
    }
    return res.status(422).json(response)
  }

  try {
    const payload = result.data
    const createStoreProductResponse = await storeProductsService.createStoreProduct(id, payload)
    const response: ApiResponse<CreateStoreProductResponse> = {
      data: createStoreProductResponse,
      success: true,
    }
    return res.status(201).json(response)
  } catch (err) {
    const error = err as Error
    const response: ApiResponse<unknown> = {
      data: null,
      success: false,
      error: error.message,
    }
    const status = err && err instanceof NotFoundError ? 404 : 500
    return res.status(status).json(response)
  }
})

storesRouter.put('/:id/products/:productId', async (req, res) => {
  const { id, productId } = req.params
  const result = updateStoreProductPayloadSchema.safeParse(req.body)
  if (!result.success) {
    const response: ApiResponse<$ZodIssue[]> = {
      data: result.error.issues,
      success: false,
      error: 'Validation failed',
    }
    return res.status(422).json(response)
  }

  try {
    const payload = result.data
    const updateStoreProductResponse = await storeProductsService.updateStoreProduct(id, productId, payload)
    const response: ApiResponse<UpdateStoreProductResponse> = {
      data: updateStoreProductResponse,
      success: true,
    }
    return res.json(response)
  } catch (err) {
    const error = err as Error
    const response: ApiResponse<unknown> = {
      data: null,
      success: false,
      error: error.message,
    }
    const status = err && err instanceof NotFoundError ? 404 : 500
    return res.status(status).json(response)
  }
})

storesRouter.delete('/:id/products/:productId', async (req, res) => {
  const { id, productId } = req.params
  try {
    await storeProductsService.deleteStoreProduct(id, productId)
    return res.status(204).send()
  } catch (err) {
    const error = err as Error
    const response: ApiResponse<unknown> = {
      data: null,
      success: false,
      error: error.message,
    }
    const status = err && err instanceof NotFoundError ? 404 : 500
    return res.status(status).json(response)
  }
})

export { storesRouter }

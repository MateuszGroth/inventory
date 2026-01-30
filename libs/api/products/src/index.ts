import { Router } from 'express'
import { getProductsQueryParamsSchema } from './lib/validate'
import { prisma } from '@org/db'
import { ProductsService } from './lib/products.service'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApiResponse, GetProductsResponse } from '@org/models'
import { $ZodIssue } from 'zod/v4/core'
import { NotFoundError } from './lib/errors'

const productsRouter: Router = Router()
const productsService = new ProductsService(prisma)

productsRouter.get('/categories', (_req, res) => {
  const response: ApiResponse<string[]> = {
    data: productsService.getCategories(),
    success: true,
  }
  return res.json(response)
})

productsRouter.get('/', async (req, res) => {
  const result = getProductsQueryParamsSchema.safeParse(req.query)
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
    const getProductsResponse = await productsService.getProducts(params)
    const response: ApiResponse<GetProductsResponse> = {
      data: getProductsResponse,
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

productsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await productsService.deleteProduct(id)
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

export { productsRouter }

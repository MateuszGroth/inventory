import {
  PrismaClient,
  Product,
  StoreProductFindManyArgs,
  StoreProductInclude,
  StoreProductOrderByWithRelationInput,
  StoreProductWhereInput,
} from '@org/db'
import { CreateStoreProductPayload, GetStoreProductsParams, UpdateStoreProductPayload } from './validate'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CreateStoreProductResponse, GetStoreProductsResponse, UpdateStoreProductResponse } from '@org/models'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import { InternalServerError, NotFoundError } from './errors'
import { toStoreProductExternal } from './transform'
import { StoreProductInternal } from './types'

export class StoreProductsService {
  private prisma: PrismaClient
  private defaultLimit = 10
  private storeProductInclude: StoreProductInclude = {
    product: true,
  }
  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getStoreProducts(storeId: string, filters: GetStoreProductsParams): Promise<GetStoreProductsResponse> {
    const orderBy = this.processStoreProductsOrderBy(filters)

    const limit = filters.limit ?? this.defaultLimit
    const page = filters.page || 1
    const offset = (page - 1) * limit

    const whereName = filters.name
      ? {
          product: {
            name: {
              contains: filters.name,
              mode: 'insensitive' as const,
            },
          },
        }
      : undefined

    const whereCategory = filters.category
      ? {
          product: {
            category: filters.category,
          },
        }
      : undefined

    const where: StoreProductWhereInput = {
      storeId,
      ...whereName,
      ...whereCategory,
    }

    const queryArgs = {
      take: limit,
      skip: offset,
      orderBy,
      where,
    } satisfies StoreProductFindManyArgs

    try {
      const total = await this.prisma.storeProduct.count({
        ...queryArgs,
        take: undefined,
        skip: undefined,
      })

      const storeProducts: StoreProductInternal[] = await this.prisma.storeProduct.findMany({
        ...queryArgs,
        include: this.storeProductInclude,
      })

      return {
        results: storeProducts.map((storeProduct) => toStoreProductExternal(storeProduct)),
        page,
        pageSize: limit,
        total,
      }
    } catch (_e) {
      void _e
      throw new InternalServerError('Something went wrong!')
    }
  }

  async createStoreProduct(storeId: string, payload: CreateStoreProductPayload): Promise<CreateStoreProductResponse> {
    try {
      // Find or create the product by name and category
      const product = await this.prisma.product.upsert({
        where: {
          name_category: { name: payload.name, category: payload.category },
        },
        update: {},
        create: {
          name: payload.name,
          category: payload.category,
        },
      })

      const storeProduct: StoreProductInternal = await this.prisma.storeProduct.create({
        data: {
          storeId,
          productId: product.id,
          quantity: payload.quantity,
          price: payload.price,
        },
        include: this.storeProductInclude,
      })

      return toStoreProductExternal(storeProduct)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new InternalServerError('Store product already exists')
        }
        if (error.code === 'P2003') {
          throw new NotFoundError('Store not found')
        }
      }
      throw new InternalServerError('Something went wrong!')
    }
  }

  async updateStoreProduct(
    storeId: string,
    productId: string,
    payload: UpdateStoreProductPayload
  ): Promise<UpdateStoreProductResponse> {
    try {
      const storeProduct: StoreProductInternal = await this.prisma.storeProduct.update({
        where: {
          storeId_productId: { storeId, productId },
        },
        data: {
          quantity: payload.quantity,
          price: payload.price,
        },
        include: this.storeProductInclude,
      })

      return toStoreProductExternal(storeProduct)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Store product not found')
      }
      throw new InternalServerError('Something went wrong!')
    }
  }

  async deleteStoreProduct(storeId: string, productId: string): Promise<void> {
    try {
      await this.prisma.storeProduct.delete({
        where: {
          storeId_productId: { storeId, productId },
        },
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Store product not found')
      }
      throw new InternalServerError('Something went wrong!')
    }
  }

  private processStoreProductsOrderBy(filters: GetStoreProductsParams): StoreProductOrderByWithRelationInput {
    const direction = filters.orderDir ?? 'desc'
    if (!filters.orderBy) {
      return { createdAt: direction }
    }

    const productFields = ['name', 'category'] satisfies Array<keyof Product>
    if ((productFields as string[]).includes(filters.orderBy)) {
      const orderBy: StoreProductOrderByWithRelationInput = { product: { [filters.orderBy]: direction } }

      return orderBy
    }

    const orderBy: StoreProductOrderByWithRelationInput = { [filters.orderBy]: direction }

    return orderBy
  }
}

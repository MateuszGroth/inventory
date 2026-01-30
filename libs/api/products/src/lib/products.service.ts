import {
  PrismaClient,
  ProductCategory,
  ProductFindManyArgs,
  ProductInclude,
  ProductOrderByWithRelationInput,
  ProductWhereInput,
} from '@org/db'
import { GetProductsParams } from './validate'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { GetProductsResponse } from '@org/models'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import { InternalServerError, NotFoundError } from './errors'
import { toProductExternal } from './transform'
import { ProductInternal } from './types'

export class ProductsService {
  private prisma: PrismaClient
  private defaultLimit = 10
  private productsInclude: ProductInclude = {
    _count: { select: { storeProducts: true } },
  }

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getProducts(filters: GetProductsParams): Promise<GetProductsResponse> {
    const orderBy = this.processProductsOrderBy(filters)

    const limit = filters.limit ?? this.defaultLimit
    const page = filters.page || 1
    const offset = (page - 1) * limit

    const whereName = filters.name
      ? {
          name: {
            contains: filters.name,
            mode: 'insensitive' as const,
          },
        }
      : undefined

    const whereCategory = filters.category
      ? {
          category: filters.category,
        }
      : undefined

    const where: ProductWhereInput = {
      ...whereName,
      ...whereCategory,
    }

    const queryArgs = {
      take: limit,
      skip: offset,
      orderBy,
      where,
    } satisfies ProductFindManyArgs

    try {
      const total = await this.prisma.product.count({
        ...queryArgs,
        take: undefined,
        skip: undefined,
      })

      const products: ProductInternal[] = await this.prisma.product.findMany({
        ...queryArgs,
        include: this.productsInclude,
      })

      return {
        results: products.map((product) => toProductExternal(product)),
        page,
        pageSize: limit,
        total,
      }
    } catch (_e) {
      void _e
      throw new InternalServerError('Something went wrong!')
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.prisma.product.delete({
        where: { id },
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Product not found')
      }
      throw new InternalServerError('Something went wrong!')
    }
  }

  getCategories(): string[] {
    return Object.values(ProductCategory)
  }

  private processProductsOrderBy(filters: GetProductsParams): ProductOrderByWithRelationInput {
    const direction = filters.orderDir ?? 'desc'
    if (!filters.orderBy) {
      return { createdAt: direction }
    }

    const orderBy: ProductOrderByWithRelationInput = { [filters.orderBy]: direction }

    return orderBy
  }
}

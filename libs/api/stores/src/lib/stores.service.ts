import { PrismaClient, StoreFindManyArgs, StoreInclude, StoreOrderByWithRelationInput, StoreWhereInput } from '@org/db'
import { CreateStorePayload, GetStoresFilters } from './validate'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CreateStoreResponse, GetStoreResponse, GetStoresResponse, UpdateStoreResponse } from '@org/models'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import { InternalServerError, NotFoundError } from './errors'
import { toStoreExternal } from './transform'
import { StoreInternal } from './types'

export class StoresService {
  private prisma: PrismaClient
  private defaultLimit = 10
  private storeInclude: StoreInclude = {
    storeProducts: {
      select: { quantity: true },
    },
  }

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getStore(id: string): Promise<GetStoreResponse> {
    try {
      const store = await this.prisma.store.findUniqueOrThrow({ where: { id }, include: this.storeInclude })

      return toStoreExternal(store)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Resource not found')
      }
      throw new InternalServerError('Something went wrong!')
    }
  }

  async getStores(filters: GetStoresFilters): Promise<GetStoresResponse> {
    const orderBy = this.processStoresOrderBy(filters)

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

    const whereLocation = filters.location
      ? {
          location: {
            contains: filters.location,
            mode: 'insensitive' as const,
          },
        }
      : undefined

    const where: StoreWhereInput = {
      ...whereName,
      ...whereLocation,
    }

    const queryArgs = {
      take: limit,
      skip: offset,
      orderBy,
      where,
    } satisfies StoreFindManyArgs

    try {
      const total = await this.prisma.store.count({
        ...queryArgs,
        take: undefined,
        skip: undefined,
      })

      const stores: StoreInternal[] = await this.prisma.store.findMany({
        ...queryArgs,
        include: this.storeInclude,
      })

      return {
        results: stores.map((store) => toStoreExternal(store)),
        page,
        pageSize: limit,
        total,
      }
    } catch (_e) {
      void _e
      throw new InternalServerError('Something went wrong!')
    }
  }

  async createStore(payload: CreateStorePayload): Promise<CreateStoreResponse> {
    try {
      const store = await this.prisma.store.create({
        data: {
          ...payload,
        },
        include: this.storeInclude,
      })

      return toStoreExternal(store)
    } catch (_e) {
      // There are no unique fields, so we don't expect Conflict errors
      void _e
      throw new InternalServerError('Something went wrong!')
    }
  }

  async updateStore(id: string, payload: CreateStorePayload): Promise<UpdateStoreResponse> {
    try {
      await this.prisma.store.findUniqueOrThrow({ where: { id } })
      const storeUpdated = await this.prisma.store.update({
        where: { id },
        data: {
          ...payload,
        },
        include: this.storeInclude,
      })

      return toStoreExternal(storeUpdated)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Resource not found')
      }

      throw new InternalServerError('Something went wrong!')
    }
  }

  async deleteStore(id: string): Promise<void> {
    try {
      await this.prisma.store.delete({
        where: {
          id,
        },
      })
    } catch (_e) {
      // There are no unique fields, so we don't expect Conflict errors
      void _e
      throw new InternalServerError('Something went wrong!')
    }
  }

  async transferStoreProducts({ storeFromId, storeToId }: { storeFromId: string; storeToId: string }): Promise<void> {
    try {
      const storeFrom = await this.prisma.store.findUniqueOrThrow({ where: { id: storeFromId } })
      const storeTo = await this.prisma.store.findUniqueOrThrow({ where: { id: storeToId } })
      await this.prisma.storeProduct.updateMany({ where: { store: storeFrom }, data: { storeId: storeTo.id } })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Resource not found')
      }

      throw new InternalServerError('Something went wrong!')
    }
  }

  private processStoresOrderBy(filters: GetStoresFilters): StoreOrderByWithRelationInput {
    const direction = filters.orderDir ?? 'desc'
    if (!filters.orderBy) {
      return { createdAt: direction }
    }

    const orderBy: StoreOrderByWithRelationInput = { [filters.orderBy]: direction }

    return orderBy
  }
}

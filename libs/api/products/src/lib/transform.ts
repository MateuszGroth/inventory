// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductExternal } from '@org/models'
import { ProductInternal } from './types'

export const toProductExternal = (product: ProductInternal): ProductExternal => {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    storesCount: product._count.storeProducts,
  }
}

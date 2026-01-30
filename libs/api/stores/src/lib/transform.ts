// eslint-disable-next-line @nx/enforce-module-boundaries
import { StoreExternal, StoreProductExternal } from '@org/models'
import { StoreInternal, StoreProductInternal } from './types'

export const toStoreExternal = (store: StoreInternal): StoreExternal => {
  return {
    id: store.id,
    name: store.name,
    location: store.location,
    productsQuantity: store.storeProducts.reduce((sum, p) => sum + p.quantity, 0),
  }
}

export const toStoreProductExternal = (storeProduct: StoreProductInternal): StoreProductExternal => {
  return {
    storeId: storeProduct.storeId,
    quantity: storeProduct.quantity,
    price: storeProduct.price,
    product: {
      id: storeProduct.product.id,
      category: storeProduct.product.category,
      name: storeProduct.product.name,
    },
  }
}

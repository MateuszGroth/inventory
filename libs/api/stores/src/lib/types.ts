import { Product, Store, StoreProduct } from '@org/db'

export type StoreInternal = Store & { storeProducts: Array<{ quantity: number }> }

export type StoreProductInternal = StoreProduct & { product: Product }

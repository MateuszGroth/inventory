import { Product } from '@org/db'

export type ProductInternal = Product & { _count: { storeProducts: number } }

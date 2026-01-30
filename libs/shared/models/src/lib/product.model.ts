export type ProductExternal = {
  id: string
  name: string
  category: string
  storesCount: number
}

export type ApiResponse<T> = {
  data: T
  success: boolean
  error?: string
}

export type StoreExternal = {
  id: string
  name: string
  location: string
  productsQuantity: number
}

export type ProductCategory = 'Electronics' | 'Clothing' | 'Food' | 'Home' | 'Toys'

export type StoreProductExternal = {
  storeId: string
  price: number
  quantity: number
  product: {
    id: string
    name: string
    category: ProductCategory
  }
}

export type PaginatedResponse<T> = {
  results: T[]
  total: number
  page: number
  pageSize: number
}

export type GetStoreResponse = StoreExternal

export type GetStoresResponse = PaginatedResponse<StoreExternal>

export type CreateStoreResponse = StoreExternal

export type UpdateStoreResponse = StoreExternal

export type GetStoreProductsResponse = PaginatedResponse<StoreProductExternal>

export type CreateStoreProductResponse = StoreProductExternal

export type UpdateStoreProductResponse = StoreProductExternal

export type GetProductsResponse = PaginatedResponse<ProductExternal>

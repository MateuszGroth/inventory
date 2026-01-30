import { ApiResponse, GetStoreProductsResponse } from '@org/models'
import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { STORE_PRODUCTS_QUERY_KEY } from '../../../constants'
import { getStoreProducts, GetStoreProductsParams } from '../services/stores'

export const useGetStoreProducts = (
  arg: { storeId: string; params?: GetStoreProductsParams },
  options?: DistributiveOmit<UseQueryOptions<ApiResponse<GetStoreProductsResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiResponse<GetStoreProductsResponse>>({
    queryKey: [STORE_PRODUCTS_QUERY_KEY, arg.storeId, arg.params],
    queryFn: () => getStoreProducts(arg),
    placeholderData: keepPreviousData,
    ...options,
  })
}

import { ApiResponse, GetProductsResponse } from '@org/models'
import { getProducts, GetProductsParams } from '../services/products'
import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query'
import { PRODUCTS_QUERY_KEY } from '../../../constants'

export const useGetProducts = (
  params?: GetProductsParams,
  options?: DistributiveOmit<UseQueryOptions<ApiResponse<GetProductsResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiResponse<GetProductsResponse>>({
    queryKey: [PRODUCTS_QUERY_KEY, params],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
    ...options,
  })
}

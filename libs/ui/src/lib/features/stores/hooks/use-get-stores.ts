import { ApiResponse, GetStoresResponse } from '@org/models'
import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { STORES_QUERY_KEY } from '../../../constants'
import { getStores, GetStoresParams } from '../services/stores'

export const useGetStores = (
  params?: GetStoresParams,
  options?: DistributiveOmit<UseQueryOptions<ApiResponse<GetStoresResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiResponse<GetStoresResponse>>({
    queryKey: [STORES_QUERY_KEY, params],
    queryFn: () => getStores(params),
    placeholderData: keepPreviousData,
    ...options,
  })
}

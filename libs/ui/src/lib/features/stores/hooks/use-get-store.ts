import { ApiResponse, GetStoreResponse } from '@org/models'
import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { STORES_QUERY_KEY } from '../../../constants'
import { getStore } from '../services/stores'

export const useGetStore = (
  id: string,
  options?: DistributiveOmit<UseQueryOptions<ApiResponse<GetStoreResponse>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiResponse<GetStoreResponse>>({
    queryKey: [STORES_QUERY_KEY, id],
    queryFn: () => getStore(id),
    placeholderData: keepPreviousData,
    ...options,
  })
}

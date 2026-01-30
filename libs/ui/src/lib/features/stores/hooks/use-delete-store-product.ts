import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PRODUCTS_QUERY_KEY, STORE_PRODUCTS_QUERY_KEY, STORES_QUERY_KEY } from '../../../constants'
import { deleteStoreProduct } from '../services/stores'

export const useDeleteStoreProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteStoreProduct,
    onSuccess: (...arg) => {
      queryClient.invalidateQueries({
        queryKey: [STORES_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [STORE_PRODUCTS_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY],
      })
    },
  })
}

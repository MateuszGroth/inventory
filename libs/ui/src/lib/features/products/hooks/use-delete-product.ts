import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PRODUCTS_QUERY_KEY, STORES_QUERY_KEY, STORE_PRODUCTS_QUERY_KEY } from '../../../constants'
import { deleteProduct } from '../services/products'

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (...arg) => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [STORES_QUERY_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [STORE_PRODUCTS_QUERY_KEY],
      })
    },
  })
}

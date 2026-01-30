import { useMutation, useQueryClient } from '@tanstack/react-query'
import { STORES_QUERY_KEY } from '../../../constants'
import { createStore } from '../services/stores'

export const useCreateStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStore,
    onSuccess: (...arg) => {
      queryClient.invalidateQueries({
        queryKey: [STORES_QUERY_KEY],
      })
    },
  })
}

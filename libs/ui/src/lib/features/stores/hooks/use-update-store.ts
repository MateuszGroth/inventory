import { useMutation, useQueryClient } from '@tanstack/react-query'
import { STORES_QUERY_KEY } from '../../../constants'
import { updateStore } from '../services/stores'

export const useUpdateStore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStore,
    onSuccess: (...arg) => {
      queryClient.invalidateQueries({
        queryKey: [STORES_QUERY_KEY],
        refetchType: 'active',
      })
    },
  })
}

import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../services/products'

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: Infinity,
  })
}

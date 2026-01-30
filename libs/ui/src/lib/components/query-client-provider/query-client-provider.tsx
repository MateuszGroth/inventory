import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

const MAX_RETRIES = 2

const commonDefaultOptions = {
  retry: (count: number) => {
    return count < MAX_RETRIES
  },
}

export const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000, // data is stale after 60 sec
        refetchOnWindowFocus: false,
        ...commonDefaultOptions,
      },
      mutations: {
        ...commonDefaultOptions,
      },
    },
  })

export const QueryClientProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(getQueryClient)

  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>
}

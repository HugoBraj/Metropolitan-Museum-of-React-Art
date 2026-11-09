import { useQuery } from '@tanstack/react-query'
import { getDepartments } from '../api/metMuseumClient'

export function useDepartments() {
  return useQuery({
    queryKey: ['metMuseum', 'departments'],
    queryFn: ({ signal }) => getDepartments(signal),
    staleTime: 24 * 60 * 60 * 1000,
  })
}
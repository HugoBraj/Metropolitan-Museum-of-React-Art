import { useQuery } from '@tanstack/react-query'
import { searchObjects } from '../api/metMuseumClient'
import type { SearchObjectsParams } from '../api/metMuseumClient'

export function useArtworkSearch(params: SearchObjectsParams, enabled = true) {
  return useQuery({
    queryKey: ['metMuseum', 'search', params],
    queryFn: ({ signal }) => searchObjects(params, signal),
    enabled,
  })
}
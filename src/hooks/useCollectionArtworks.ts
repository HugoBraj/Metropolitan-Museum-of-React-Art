import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getObjectById, searchObjects } from '../api/metMuseumClient'
import { MAX_SEARCH_WINDOW } from '../api/metMuseumClient'
import type { MetObject, ObjectSearchResponse, SearchObjectsParams } from '../api/metMuseumClient'

export const COLLECTION_PAGE_SIZE = 12

export interface CollectionArtworkPage extends ObjectSearchResponse {
  artworks: MetObject[]
}

export function useCollectionArtworks(params: SearchObjectsParams, page: number) {
  const queryClient = useQueryClient()

  return useQuery<CollectionArtworkPage>({
    queryKey: ['metMuseum', 'collection', params, page],
    queryFn: async ({ signal }) => {
      const offset = page * COLLECTION_PAGE_SIZE
      const limit = Math.min(COLLECTION_PAGE_SIZE, MAX_SEARCH_WINDOW - offset)
      const results = await searchObjects({
        ...params,
        offset,
        limit,
      }, signal)

      const artworks = await Promise.all(
        results.objectIDs.map((objectID) =>
          queryClient.fetchQuery({
            queryKey: ['metMuseum', 'object', objectID],
            queryFn: ({ signal: objectSignal }) => getObjectById(objectID, objectSignal),
            staleTime: 5 * 60 * 1000,
          }),
        ),
      )

      return { ...results, artworks }
    },
  })
}
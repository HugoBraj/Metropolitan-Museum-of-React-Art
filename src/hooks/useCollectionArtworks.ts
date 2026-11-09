import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getObjectById, searchObjects } from '../api/metMuseumClient'
import { MAX_SEARCH_WINDOW } from '../api/metMuseumClient'
import type { MetObject, ObjectSearchResponse, SearchObjectsParams } from '../api/metMuseumClient'
import { findArtworkRegion } from '../constants/artworkRegions'
import type { ArtworkRegionSlug } from '../constants/artworkRegions'

export const COLLECTION_PAGE_SIZE = 12

export interface CollectionArtworkPage extends ObjectSearchResponse {
  artworks: MetObject[]
}

export function useCollectionArtworks(
  params: SearchObjectsParams,
  page: number,
  regionSlug?: ArtworkRegionSlug,
) {
  const queryClient = useQueryClient()
  const region = findArtworkRegion(regionSlug)

  return useQuery<CollectionArtworkPage>({
    queryKey: ['metMuseum', 'collection', params, page, regionSlug],
    queryFn: async ({ signal }) => {
      let results: ObjectSearchResponse

      if (region) {
        const perLocationLimit = Math.ceil(COLLECTION_PAGE_SIZE / region.geoLocations.length)
        const offset = page * perLocationLimit
        const limit = Math.min(perLocationLimit, MAX_SEARCH_WINDOW - offset)
        const locationResults = await Promise.all(
          region.geoLocations.map((geoLocation) =>
            searchObjects({
              ...params,
              geoLocation,
              offset,
              limit,
            }, signal),
          ),
        )
        results = {
          total: locationResults.reduce((total, locationResult) => total + locationResult.total, 0),
          objectIDs: [...new Set(locationResults.flatMap((locationResult) => locationResult.objectIDs))]
            .slice(0, COLLECTION_PAGE_SIZE),
        }
      } else {
        const offset = page * COLLECTION_PAGE_SIZE
        const limit = Math.min(COLLECTION_PAGE_SIZE, MAX_SEARCH_WINDOW - offset)
        results = await searchObjects({ ...params, offset, limit }, signal)
      }

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
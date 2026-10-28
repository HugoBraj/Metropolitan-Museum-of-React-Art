import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getObjectById, searchObjects } from '../api/metMuseumClient'
import type { MetObject } from '../api/metMuseumClient'
import { findArtworkRegion } from '../constants/artworkRegions'

const REGION_ARTWORK_LIMIT = 12
const OBJECT_STALE_TIME = 5 * 60 * 1000

export function useRegionArtworks(regionSlug: string | undefined) {
  const queryClient = useQueryClient()
  const region = findArtworkRegion(regionSlug)

  return useQuery<MetObject[]>({
    queryKey: ['metMuseum', 'regionArtworks', regionSlug],
    enabled: region !== undefined,
    staleTime: OBJECT_STALE_TIME,
    queryFn: async ({ signal }) => {
      if (!region) {
        throw new RangeError('A valid artwork region is required.')
      }

      const limitPerLocation = Math.ceil(REGION_ARTWORK_LIMIT / region.geoLocations.length)
      const searchResults = await Promise.all(
        region.geoLocations.map((geoLocation) =>
          searchObjects({ geoLocation, limit: limitPerLocation }, signal),
        ),
      )
      const objectIDs = [...new Set(searchResults.flatMap((result) => result.objectIDs))]
        .slice(0, REGION_ARTWORK_LIMIT)

      return Promise.all(
        objectIDs.map((objectID) =>
          queryClient.fetchQuery({
            queryKey: ['metMuseum', 'object', objectID],
            queryFn: ({ signal: objectSignal }) => getObjectById(objectID, objectSignal),
            staleTime: OBJECT_STALE_TIME,
          }),
        ),
      )
    },
  })
}
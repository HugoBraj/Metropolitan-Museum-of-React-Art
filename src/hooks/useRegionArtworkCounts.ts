import { useQueries } from '@tanstack/react-query'
import { searchObjects } from '../api/metMuseumClient'
import { ARTWORK_REGIONS } from '../constants/artworkRegions'
import type { ArtworkRegionSlug } from '../constants/artworkRegions'

export type RegionArtworkCounts = Partial<Record<ArtworkRegionSlug, number>>

const COUNT_STALE_TIME = 24 * 60 * 60 * 1000

export function useRegionArtworkCounts(enabled = true) {
  const queries = useQueries({
    queries: ARTWORK_REGIONS.map((region) => ({
      queryKey: ['metMuseum', 'regionArtworkCount', region.slug],
      queryFn: async ({ signal }) => {
        const responses = await Promise.all(
          region.geoLocations.map((geoLocation) =>
            searchObjects({ geoLocation, limit: 1 }, signal),
          ),
        )
        return responses.reduce((total, response) => total + response.total, 0)
      },
      staleTime: COUNT_STALE_TIME,
      enabled,
    })),
  })

  const counts: RegionArtworkCounts = {}
  queries.forEach((query, index) => {
    const region = ARTWORK_REGIONS[index]
    if (region && query.data !== undefined) {
      counts[region.slug] = query.data
    }
  })

  return {
    counts,
    isLoading: queries.some((query) => query.isPending),
    isError: queries.some((query) => query.isError),
  }
}
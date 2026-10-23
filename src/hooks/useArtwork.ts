import { useQuery } from '@tanstack/react-query'
import { getObjectById } from '../api/metMuseumClient'

export function useArtwork(objectID: number | undefined) {
  return useQuery({
    queryKey: ['metMuseum', 'object', objectID],
    queryFn: ({ signal }) => {
      if (objectID === undefined) {
        throw new RangeError('Object ID is required.')
      }

      return getObjectById(objectID, signal)
    },
    enabled: Number.isInteger(objectID) && (objectID ?? 0) > 0,
  })
}
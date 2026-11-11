import { useEffect, useState } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { getObjectById, searchObjects } from '../api/metMuseumClient'

const SUGGESTION_LIMIT = 8
const DEBOUNCE_MS = 300
const STALE_TIME_MS = 5 * 60 * 1000

export function useArtworkSuggestions(searchTerm: string) {
  const query = searchTerm.trim()
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [query])

  const isCurrentQuery = query.length >= 2 && query === debouncedQuery
  const search = useQuery({
    queryKey: ['metMuseum', 'suggestions', debouncedQuery],
    queryFn: ({ signal }) => searchObjects({ q: debouncedQuery, limit: SUGGESTION_LIMIT }, signal),
    enabled: isCurrentQuery,
    staleTime: STALE_TIME_MS,
    retry: 1,
  })

  const details = useQueries({
    queries: (isCurrentQuery ? search.data?.objectIDs ?? [] : []).slice(0, SUGGESTION_LIMIT).map((objectID) => ({
      queryKey: ['metMuseum', 'object', objectID],
      queryFn: ({ signal }: { signal: AbortSignal }) => getObjectById(objectID, signal),
      staleTime: STALE_TIME_MS,
      retry: 1,
    })),
  })

  return {
    suggestions: details.flatMap((detail) => detail.data ? [detail.data] : []),
    isLoading: query.length >= 2 && (!isCurrentQuery || search.isPending || details.some((detail) => detail.isPending)),
    isError: isCurrentQuery && (search.isError || details.some((detail) => detail.isError)),
    isReady: isCurrentQuery && search.isSuccess && details.every((detail) => !detail.isPending),
  }
}
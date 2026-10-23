const API_ROOT = 'https://collectionapi.metmuseum.org/public/collection'
const SEARCH_ENDPOINT = `${API_ROOT}/v1.1/search`
const OBJECT_ENDPOINT = `${API_ROOT}/v1/objects`
const DEFAULT_SEARCH_LIMIT = 20
const MAX_SEARCH_LIMIT = 500
const MAX_SEARCH_WINDOW = 10_000

export interface SearchObjectsParams {
  q?: string
  isHighlight?: boolean
  title?: boolean
  tags?: boolean
  departmentId?: number
  isOnView?: boolean
  artistOrCulture?: boolean
  medium?: string
  hasImages?: boolean
  geoLocation?: string
  dateBegin?: number
  dateEnd?: number
  offset?: number
  limit?: number
}

export interface ObjectSearchResponse {
  total: number
  objectIDs: number[]
}

export interface MetObject {
  objectID: number
  isHighlight?: boolean | null
  isPublicDomain?: boolean | null
  primaryImage?: string | null
  primaryImageSmall?: string | null
  additionalImages?: string[] | null
  department?: string | null
  objectName?: string | null
  title?: string | null
  culture?: string | null
  period?: string | null
  artistDisplayName?: string | null
  artistDisplayBio?: string | null
  artistNationality?: string | null
  objectDate?: string | null
  objectBeginDate?: number | null
  objectEndDate?: number | null
  medium?: string | null
  dimensions?: string | null
  country?: string | null
  region?: string | null
  objectURL?: string | null
}

interface RawObjectSearchResponse {
  total: number
  objectIDs: number[] | null
}

export class MetMuseumApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'MetMuseumApiError'
    this.status = status
  }
}

function validateSearchParams(offset: number, limit: number): void {
  if (!Number.isInteger(offset) || offset < 0) {
    throw new RangeError('Search offset must be a non-negative integer.')
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_SEARCH_LIMIT) {
    throw new RangeError(`Search limit must be an integer between 1 and ${MAX_SEARCH_LIMIT}.`)
  }

  if (offset + limit > MAX_SEARCH_WINDOW) {
    throw new RangeError(`Search offset and limit cannot exceed ${MAX_SEARCH_WINDOW}.`)
  }
}

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new MetMuseumApiError(
      `Met Museum API request failed with status ${response.status}.`,
      response.status,
    )
  }

  return (await response.json()) as T
}

export async function searchObjects(
  params: SearchObjectsParams,
  signal?: AbortSignal,
): Promise<ObjectSearchResponse> {
  const {
    offset = 0,
    limit = DEFAULT_SEARCH_LIMIT,
    ...filters
  } = params

  validateSearchParams(offset, limit)

  if ((filters.dateBegin === undefined) !== (filters.dateEnd === undefined)) {
    throw new TypeError('Search dateBegin and dateEnd must be provided together.')
  }

  const searchParams = new URLSearchParams({ offset: String(offset), limit: String(limit) })
  let hasFilter = false

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || (typeof value === 'string' && value.trim() === '')) {
      continue
    }

    hasFilter = true
    searchParams.set(key, String(value).trim())
  }

  if (!hasFilter) {
    throw new TypeError('Provide a search query or at least one search filter.')
  }

  const response = await requestJson<RawObjectSearchResponse>(
    `${SEARCH_ENDPOINT}?${searchParams.toString()}`,
    signal,
  )

  return {
    total: response.total,
    objectIDs: response.objectIDs ?? [],
  }
}

export function getObjectById(objectID: number, signal?: AbortSignal): Promise<MetObject> {
  if (!Number.isInteger(objectID) || objectID < 1) {
    throw new RangeError('Object ID must be a positive integer.')
  }

  return requestJson<MetObject>(`${OBJECT_ENDPOINT}/${objectID}`, signal)
}
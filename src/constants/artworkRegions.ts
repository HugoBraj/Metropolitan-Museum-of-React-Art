export const ARTWORK_REGIONS = [
  { slug: 'africa', label: 'Africa', svgId: 'africa', geoLocations: ['Africa'] },
  { slug: 'asia', label: 'Asia', svgId: 'asia', geoLocations: ['Asia'] },
  { slug: 'europe', label: 'Europe', svgId: 'europe', geoLocations: ['Europe'] },
  {
    slug: 'north-america',
    label: 'North America',
    svgId: 'northAmerica',
    geoLocations: ['United States', 'Canada', 'Mexico', 'Cuba', 'Guatemala', 'Costa Rica'],
  },
  {
    slug: 'south-america',
    label: 'South America',
    svgId: 'southAmerica',
    geoLocations: ['South America'],
  },
  { slug: 'oceania', label: 'Oceania', svgId: 'oceania', geoLocations: ['Oceania'] },
] as const

export type ArtworkRegionSlug = (typeof ARTWORK_REGIONS)[number]['slug']

export function findArtworkRegion(slug: string | undefined) {
  return ARTWORK_REGIONS.find((region) => region.slug === slug)
}
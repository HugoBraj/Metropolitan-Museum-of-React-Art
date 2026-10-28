import { useEffect, useRef } from 'react'
import continentMapSource from '../../assets/continentsLow.svg?raw'
import { ARTWORK_REGIONS } from '../../constants/artworkRegions'
import type { ArtworkRegionSlug } from '../../constants/artworkRegions'
import styles from './WorldMap.module.css'

interface WorldMapProps {
  onSelectRegion: (region: ArtworkRegionSlug) => void
}

const sourceDocument = new DOMParser().parseFromString(continentMapSource, 'image/svg+xml')
const sourceSvg = sourceDocument.documentElement
const mapViewBox = sourceSvg.getAttribute('viewBox') ?? '0 0 960 960'
const mapContents = sourceSvg.innerHTML

export function WorldMap({ onSelectRegion }: WorldMapProps) {
  const mapRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const mapElement = mapRef.current
    if (!mapElement) {
      return
    }

    for (const region of ARTWORK_REGIONS) {
      const path = mapElement.querySelector<SVGPathElement>(`#${region.svgId}`)
      if (!path) {
        continue
      }

      path.setAttribute('role', 'link')
      path.setAttribute('tabindex', '0')
      path.setAttribute('aria-label', `Browse ${region.label} artworks`)
      path.dataset.region = region.slug
    }

    function selectRegion(path: SVGPathElement) {
      const region = ARTWORK_REGIONS.find((entry) => entry.slug === path.dataset.region)
      if (region) {
        onSelectRegion(region.slug)
      }
    }

    function handleMapClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) {
        return
      }

      const path = event.target.closest<SVGPathElement>('path[data-region]')
      if (path) {
        selectRegion(path)
      }
    }

    function handleMapKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Enter' || !(event.target instanceof Element)) {
        return
      }

      const path = event.target.closest<SVGPathElement>('path[data-region]')
      if (path) {
        selectRegion(path)
      }
    }

    mapElement.addEventListener('click', handleMapClick)
    mapElement.addEventListener('keydown', handleMapKeyDown)

    return () => {
      mapElement.removeEventListener('click', handleMapClick)
      mapElement.removeEventListener('keydown', handleMapKeyDown)
    }
  }, [onSelectRegion])

  return (
    <svg
      aria-label="Interactive map. Select a continent to browse its artworks."
      className={styles.worldMap}
      ref={mapRef}
      role="group"
      viewBox={mapViewBox}
      dangerouslySetInnerHTML={{ __html: mapContents }}
    />
  )
}
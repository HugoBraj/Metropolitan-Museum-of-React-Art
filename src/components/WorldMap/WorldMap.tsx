import { useEffect, useRef, useState } from 'react'
import continentMapSource from '../../assets/continentsLow.svg?raw'
import { ARTWORK_REGIONS } from '../../constants/artworkRegions'
import type { ArtworkRegionSlug } from '../../constants/artworkRegions'
import type { RegionArtworkCounts } from '../../hooks/useRegionArtworkCounts'
import styles from './WorldMap.module.css'

interface WorldMapProps {
  onSelectRegion: (region: ArtworkRegionSlug) => void
  regionArtworkCounts?: RegionArtworkCounts
  isRegionCountLoading?: boolean
  isRegionCountError?: boolean
}

const sourceDocument = new DOMParser().parseFromString(continentMapSource, 'image/svg+xml')
const sourceSvg = sourceDocument.documentElement
const mapViewBox = sourceSvg.getAttribute('viewBox') ?? '0 0 960 960'
const mapContents = sourceSvg.innerHTML

export function WorldMap({
  onSelectRegion,
  regionArtworkCounts = {},
  isRegionCountLoading = false,
  isRegionCountError = false,
}: WorldMapProps) {
  const mapRef = useRef<SVGSVGElement>(null)
  const [hoveredRegionSlug, setHoveredRegionSlug] = useState<ArtworkRegionSlug>()
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)
  const hoveredRegion = ARTWORK_REGIONS.find((region) => region.slug === hoveredRegionSlug)
  const hoveredCount = hoveredRegion ? regionArtworkCounts[hoveredRegion.slug] : undefined

  function updateTooltipPosition(path: SVGPathElement | null) {
    const mapElement = mapRef.current
    if (!mapElement || !path) {
      setTooltipPosition(null)
      return
    }

    if (typeof path.getBBox !== 'function') {
      setTooltipPosition({ x: 50, y: 80 })
      return
    }

    const pathBox = path.getBBox()
    const viewBox = mapElement.viewBox.baseVal
    if (viewBox.width === 0 || viewBox.height === 0) {
      setTooltipPosition({ x: 50, y: 80 })
      return
    }
    const xPercent = ((pathBox.x + pathBox.width / 2) / (viewBox.width || 1)) * 100
    const yPercent = ((pathBox.y + pathBox.height / 2) / (viewBox.height || 1)) * 100

    setTooltipPosition({ x: xPercent, y: yPercent })
  }

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
      const count = regionArtworkCounts[region.slug]
      if (count !== undefined) {
        path.setAttribute('title', `${region.label}: ${count.toLocaleString()} artworks`)
      }
    }

    function getRegionPath(target: EventTarget | null): SVGPathElement | null {
      if (!(target instanceof Element)) {
        return null
      }
      return target.closest<SVGPathElement>('path[data-region]')
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

    function handleMapMouseOver(event: MouseEvent) {
      const path = getRegionPath(event.target)
      const region = ARTWORK_REGIONS.find((entry) => entry.slug === path?.dataset.region)
      setHoveredRegionSlug(region?.slug)
      updateTooltipPosition(path)
    }

    function handleMapMouseOut(event: MouseEvent) {
      const path = getRegionPath(event.relatedTarget)
      const region = ARTWORK_REGIONS.find((entry) => entry.slug === path?.dataset.region)
      setHoveredRegionSlug(region?.slug)
      if (!path) {
        setTooltipPosition(null)
      }
    }

    function handleMapFocusIn(event: FocusEvent) {
      const path = getRegionPath(event.target)
      const region = ARTWORK_REGIONS.find((entry) => entry.slug === path?.dataset.region)
      setHoveredRegionSlug(region?.slug)
      updateTooltipPosition(path)
    }

    function handleMapFocusOut(event: FocusEvent) {
      const path = getRegionPath(event.relatedTarget)
      const region = ARTWORK_REGIONS.find((entry) => entry.slug === path?.dataset.region)
      setHoveredRegionSlug(region?.slug)
      if (!path) {
        setTooltipPosition(null)
      }
    }

    mapElement.addEventListener('click', handleMapClick)
    mapElement.addEventListener('keydown', handleMapKeyDown)
    mapElement.addEventListener('mouseover', handleMapMouseOver)
    mapElement.addEventListener('mouseout', handleMapMouseOut)
    mapElement.addEventListener('focusin', handleMapFocusIn)
    mapElement.addEventListener('focusout', handleMapFocusOut)

    return () => {
      mapElement.removeEventListener('click', handleMapClick)
      mapElement.removeEventListener('keydown', handleMapKeyDown)
      mapElement.removeEventListener('mouseover', handleMapMouseOver)
      mapElement.removeEventListener('mouseout', handleMapMouseOut)
      mapElement.removeEventListener('focusin', handleMapFocusIn)
      mapElement.removeEventListener('focusout', handleMapFocusOut)
    }
  }, [onSelectRegion, regionArtworkCounts])

  return (
    <div className={styles.worldMapStage}>
      <svg
        aria-label="Interactive map. Select a continent to browse its artworks."
        className={styles.worldMap}
        ref={mapRef}
        role="group"
        viewBox={mapViewBox}
        dangerouslySetInnerHTML={{ __html: mapContents }}
      />
      {hoveredRegion && tooltipPosition && (
        <div
          className={styles.regionTooltip}
          id="continent-region-tooltip"
          role="tooltip"
          style={{
            left: `${tooltipPosition.x}%`,
            top: `${tooltipPosition.y}%`,
          }}
        >
          <strong>{hoveredRegion.label}</strong>
          <span>
            {hoveredCount !== undefined
              ? `${hoveredCount.toLocaleString()} artworks`
              : isRegionCountError
                ? 'Artwork count unavailable'
                : isRegionCountLoading
                  ? 'Loading artwork count...'
                  : 'Artwork count unavailable'}
          </span>
        </div>
      )}
    </div>
  )
}
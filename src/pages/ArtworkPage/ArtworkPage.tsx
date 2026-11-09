import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useArtwork } from '../../hooks/useArtwork'
import styles from './ArtworkPage.module.css'

function readText(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function parseArtworkDimensions(rawDimensions: string | null | undefined): {
  widthCm: number
  heightCm: number
  depthCm: number | null
  label: string
} | null {
  if (!rawDimensions) {
    return null
  }

  const normalized = rawDimensions.replace(/×/g, 'x').replace(/\s+/g, ' ').trim()
  const match = normalized.match(/(-?\d+(?:[.,]\d+)?)\s*(?:x|by)\s*(-?\d+(?:[.,]\d+)?)\s*(?:(?:x|by)\s*(-?\d+(?:[.,]\d+)?))?\s*([a-zA-Z]+)?/i)

  if (!match) {
    return null
  }

  const width = Number.parseFloat(match[1].replace(',', '.'))
  const height = Number.parseFloat(match[2].replace(',', '.'))
  const depth = match[3] ? Number.parseFloat(match[3].replace(',', '.')) : null
  const unit = (match[4] ?? 'cm').toLowerCase()

  const normalizeToCm = (value: number, currentUnit: string) => {
    switch (currentUnit) {
      case 'mm':
        return value / 10
      case 'cm':
        return value
      case 'm':
        return value * 100
      case 'in':
      case 'inch':
      case 'inches':
        return value * 2.54
      default:
        return value
    }
  }

  const widthCm = normalizeToCm(width, unit)
  const heightCm = normalizeToCm(height, unit)
  const depthCm = depth === null ? null : normalizeToCm(depth, unit)

  if (!Number.isFinite(widthCm) || !Number.isFinite(heightCm) || widthCm <= 0 || heightCm <= 0) {
    return null
  }

  return {
    widthCm,
    heightCm,
    depthCm,
    label: `${width} × ${height}${depth !== null ? ` × ${depth}` : ''} ${unit}`,
  }
}

export function ArtworkPage() {
  const { objectId } = useParams()
  const parsedObjectId = Number(objectId)
  const artworkQuery = useArtwork(Number.isInteger(parsedObjectId) ? parsedObjectId : undefined)
  const [imageFailed, setImageFailed] = useState(false)
  const [isRealSizeOpen, setIsRealSizeOpen] = useState(false)

  if (artworkQuery.isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingState}>Loading artwork...</div>
      </main>
    )
  }

  if (artworkQuery.isError) {
    return (
      <main className={styles.page}>
        <div className={styles.errorState}>Unable to load this artwork.</div>
      </main>
    )
  }

  const artwork = artworkQuery.data

  if (!artwork) {
    return (
      <main className={styles.page}>
        <div className={styles.emptyState}>Artwork not found.</div>
      </main>
    )
  }

  const imageUrl = artwork.primaryImage || artwork.primaryImageSmall
  const title = readText(artwork.title) || 'Untitled artwork'
  const artist = readText(artwork.artistDisplayName) || 'Artist unknown'
  const date = readText(artwork.objectDate)
  const department = readText(artwork.department)
  const country = readText(artwork.country)
  const region = readText(artwork.region)
  const medium = readText(artwork.medium)
  const culture = readText(artwork.culture)
  const period = readText(artwork.period)
  const origin = country || region
  const objectName = readText(artwork.objectName)
  const dimensions = readText(artwork.dimensions)
  const parsedDimensions = parseArtworkDimensions(dimensions)
  const humanHeightCm = 165
  const artworkScaleWidth = parsedDimensions ? Math.min(82, Math.max(18, (parsedDimensions.widthCm / humanHeightCm) * 100)) : 32
  const artworkScaleHeight = parsedDimensions ? Math.min(72, Math.max(18, (parsedDimensions.heightCm / humanHeightCm) * 100)) : 48
  const description = artwork.objectURL
    ? `Explore the museum record for ${title}.`
    : 'No description provided by the Metropolitan Museum of Art.'

  return (
    <main className={styles.page}>
      <article className={styles.artworkLayout}>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.artistLine}>{artist}</p>
        </header>

        <div className={styles.content}>
          <section className={styles.copyColumn} id="artwork-details">
            <div className={styles.metaRow}>
              {date ? <span>{date}</span> : null}
              {origin ? <span>{origin}</span> : null}
              {department ? <span>{department}</span> : null}
            </div>

            <div className={styles.dimensions}>
              {dimensions ?? 'Dimensions unavailable'}
              {artwork.objectURL ? (
                <>
                  {' '}
                  <button
                    className={styles.realSizeLink}
                    onClick={() => setIsRealSizeOpen(true)}
                    type="button"
                  >
                    Visualize real size
                  </button>
                </>
              ) : null}
            </div>

            <p className={styles.description}>
              {medium ? `${medium}. ` : ''}
              {description}
            </p>

            <div className={styles.infoGrid}>
              {culture ? (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Culture</span>
                  <span className={styles.infoValue}>{culture}</span>
                </div>
              ) : null}

              {period ? (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Period</span>
                  <span className={styles.infoValue}>{period}</span>
                </div>
              ) : null}

              {origin ? (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Origin</span>
                  <span className={styles.infoValue}>{origin}</span>
                </div>
              ) : null}

              {objectName ? (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Object</span>
                  <span className={styles.infoValue}>{objectName}</span>
                </div>
              ) : null}
            </div>
          </section>

          <aside className={styles.imagePanel} aria-label={`Image of ${title}`}>
            {imageUrl && !imageFailed ? (
              <img
                alt={title}
                className={styles.image}
                onError={() => setImageFailed(true)}
                src={imageUrl}
              />
            ) : (
              <span aria-label={`No image available for ${title}`} className={styles.imageFallback} role="img">
                Image unavailable
              </span>
            )}
          </aside>
        </div>
      </article>

      {isRealSizeOpen ? (
        <div className={styles.modalOverlay} onClick={() => setIsRealSizeOpen(false)} role="presentation">
          <div className={styles.realSizeModal} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="real-size-title">
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle} id="real-size-title">Real size comparison</h2>
              <button className={styles.closeButton} onClick={() => setIsRealSizeOpen(false)} type="button" aria-label="Close comparison">
                ×
              </button>
            </div>

            <div className={styles.scaleComparison}>
              <div className={styles.humanColumn}>
                <div className={styles.humanFigure} aria-label="Human silhouette, 1 meter 65">
                  <span className={styles.humanHead} />
                  <span className={styles.humanBody} />
                  <span className={styles.humanArm} />
                  <span className={styles.humanLeg} />
                </div>
                <span className={styles.measureLabel}>1m65</span>
              </div>

              <div className={styles.objectColumn}>
                {parsedDimensions ? (
                  <div
                    className={`${styles.objectFigure} ${parsedDimensions.depthCm ? styles.objectFigureCube : ''}`}
                    style={{
                      ['--object-width' as string]: `${artworkScaleWidth}%`,
                      ['--object-height' as string]: `${artworkScaleHeight}%`,
                    }}
                  >
                    <span className={styles.objectFront} />
                    {parsedDimensions.depthCm ? (
                      <>
                        <span className={styles.objectSide} />
                        <span className={styles.objectTop} />
                      </>
                    ) : null}
                  </div>
                ) : (
                  <div className={styles.objectFigureFallback}>
                    <span>Artwork scale</span>
                  </div>
                )}
                <span className={styles.measureLabel}>
                  {parsedDimensions ? parsedDimensions.label : 'Relative scale'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
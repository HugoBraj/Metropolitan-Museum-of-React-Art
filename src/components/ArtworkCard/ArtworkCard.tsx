import { Link } from 'react-router-dom'
import type { MetObject } from '../../api/metMuseumClient'
import { useArtworkImage } from '../../hooks/useArtworkImage'
import type { BreadcrumbItem } from '../Breadcrumbs/Breadcrumbs'
import styles from './ArtworkCard.module.css'

interface ArtworkCardProps {
  artwork: MetObject
  breadcrumbItems?: BreadcrumbItem[]
}

export function ArtworkCard({ artwork, breadcrumbItems }: ArtworkCardProps) {
  const { imageUrl, handleImageError } = useArtworkImage(
    [artwork.primaryImageSmall, artwork.primaryImage, ...(artwork.additionalImages ?? [])],
    artwork.objectID,
  )
  const title = artwork.title?.trim() || 'Untitled artwork'

  return (
    <article className={styles.artworkCard}>
      <Link
        className={styles.artworkLink}
        state={breadcrumbItems ? { breadcrumbItems } : undefined}
        to={`/objects/${artwork.objectID}`}
      >
        <figure className={styles.artworkFigure}>
          {imageUrl ? (
            <img
              alt={title}
              className={styles.artworkImage}
              onError={handleImageError}
              src={imageUrl}
            />
          ) : (
            <span aria-label={`No image available for ${title}`} className={styles.imageFallback} role="img">
              Image unavailable
            </span>
          )}
          <figcaption className={styles.artworkCaption}>
            <span className={styles.artworkTitle}>{title}</span>
            <span className={styles.artworkArtist}>
              {artwork.artistDisplayName?.trim() || 'Artist unknown'}
            </span>
            <span className={styles.artworkDate}>{artwork.objectDate?.trim() || 'Date unknown'}</span>
          </figcaption>
        </figure>
      </Link>
    </article>
  )
}
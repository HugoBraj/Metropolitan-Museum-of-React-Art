import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { MetObject } from '../../api/metMuseumClient'
import styles from './ArtworkCard.module.css'

interface ArtworkCardProps {
  artwork: MetObject
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = artwork.primaryImageSmall || artwork.primaryImage
  const title = artwork.title?.trim() || 'Untitled artwork'

  return (
    <article className={styles.artworkCard}>
      <Link className={styles.artworkLink} to={`/objects/${artwork.objectID}`}>
        <figure className={styles.artworkFigure}>
          {imageUrl && !imageFailed ? (
            <img
              alt={title}
              className={styles.artworkImage}
              onError={() => setImageFailed(true)}
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
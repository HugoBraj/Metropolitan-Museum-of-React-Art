import { useState } from 'react'

type ArtworkImageSource = string | null | undefined

export function useArtworkImage(imageSources: ArtworkImageSource[], resetKey: number) {
  const [imageState, setImageState] = useState({ resetKey, index: 0 })
  const imageIndex = imageState.resetKey === resetKey ? imageState.index : 0
  const imageUrls = Array.from(new Set(
    imageSources.flatMap((source) =>
      typeof source === 'string' && source.trim() !== '' ? [source.trim()] : [],
    ),
  ))

  function handleImageError() {
    setImageState({ resetKey, index: imageIndex + 1 })
  }

  return {
    imageUrl: imageUrls[imageIndex],
    handleImageError,
  }
}
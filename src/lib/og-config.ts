export interface OGImageConfig {
  title: string
  description?: string
  image?: string
  icon?: string
  width?: number
  height?: number
  backgroundColor?: string
  titleColor?: string
  descriptionColor?: string
  fontSize?: {
    title: number
    description: number
  }
  fontFamily?: string
  borderRadius?: number
}

export interface OGMetaTags {
  title: string
  description: string
  image: string
  url: string
  type?: 'website' | 'article' | 'profile'
  twitterHandle?: string
}

export const defaultOGConfig: OGImageConfig = {
  title: 'Imagine App',
  description: 'Build amazing applications with TanStack',
  width: 1200,
  height: 630,
  backgroundColor: '#ffffff',
  titleColor: '#000000',
  descriptionColor: '#666666',
  fontSize: {
    title: 60,
    description: 30,
  },
  fontFamily: 'system-ui, -apple-system, sans-serif',
  borderRadius: 12,
}

export function generateOGImageUrl(
  config: Partial<OGImageConfig>,
  baseUrl: string,
): string {
  const merged = { ...defaultOGConfig, ...config }

  const params = new URLSearchParams({
    title: merged.title,
    ...(merged.description && { description: merged.description }),
    ...(merged.image && { image: merged.image }),
    ...(merged.backgroundColor && { bgColor: merged.backgroundColor }),
    ...(merged.titleColor && { titleColor: merged.titleColor }),
    ...(merged.descriptionColor && {
      descriptionColor: merged.descriptionColor,
    }),
    ...(merged.fontSize?.title && {
      titleSize: merged.fontSize.title.toString(),
    }),
    ...(merged.fontSize?.description && {
      descSize: merged.fontSize.description.toString(),
    }),
  })

  return `${baseUrl.replace(/\/$/, '')}/og?${params.toString()}`
}

export function createOGMetaTags(config: OGMetaTags) {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    twitterHandle,
  } = config

  return {
    meta: [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      ...(twitterHandle
        ? [{ name: 'twitter:creator', content: twitterHandle }]
        : []),
      { name: 'description', content: description },
    ],
  }
}

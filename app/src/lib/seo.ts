import { useEffect } from 'react'
import { siteOrigin } from './site'

interface PageMeta {
  title: string
  description?: string
  image?: string
  noindex?: boolean
}

function upsert(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function usePageMeta({ title, description, image, noindex }: PageMeta) {
  useEffect(() => {
    document.title = title
    if (description) {
      upsert('meta[name="description"]', 'name', 'description', description)
      upsert('meta[property="og:description"]', 'property', 'og:description', description)
      upsert('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    }
    upsert('meta[property="og:title"]', 'property', 'og:title', title)
    upsert('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    const origin = siteOrigin()
    const pageUrl = `${origin}${window.location.pathname}${window.location.search}`
    upsert('meta[property="og:url"]', 'property', 'og:url', pageUrl)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = pageUrl

    const imageUrl = new URL(image || '/images/hero.jpg', origin).href
    upsert('meta[property="og:image"]', 'property', 'og:image', imageUrl)
    upsert('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl)

    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.appendChild(robots)
    }
    robots.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow')
  }, [description, image, noindex, title])
}

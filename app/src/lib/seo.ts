import { useEffect } from 'react'

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
    upsert('meta[property="og:url"]', 'property', 'og:url', window.location.href)

    const imageUrl = image ? new URL(image, window.location.origin).href : `${window.location.origin}/images/hero.jpg`
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

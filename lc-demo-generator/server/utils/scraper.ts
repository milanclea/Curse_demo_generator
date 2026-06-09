import { load } from 'cheerio'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'de,en;q=0.8',
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const html = await $fetch<string>(url, {
      responseType: 'text',
      headers: HEADERS,
      timeout: 8000,
    })
    return typeof html === 'string' ? html : null
  } catch {
    return null
  }
}

function extractText(html: string): string[] {
  const $ = load(html)

  // Remove clutter
  $('script, style, noscript, nav, footer, header, aside, [class*="cookie"], [class*="banner"], [id*="cookie"], [id*="banner"], [class*="modal"], iframe, svg').remove()

  const lines: string[] = []

  // Meta
  const title = $('title').text().trim()
  if (title) lines.push(`Firmenname / Seitentitel: ${title}`)

  const metaDesc = $('meta[name="description"]').attr('content')?.trim()
  if (metaDesc) lines.push(`Kurzbeschreibung: ${metaDesc}`)

  const ogDesc = $('meta[property="og:description"]').attr('content')?.trim()
  if (ogDesc && ogDesc !== metaDesc) lines.push(`Beschreibung: ${ogDesc}`)

  // Headings
  $('h1, h2, h3').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim()
    if (text.length > 3 && text.length < 200) lines.push(text)
  })

  // Paragraphs & list items
  $('p, li').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim()
    if (text.length > 40 && text.length < 600) lines.push(text)
  })

  return lines
}

export async function scrapeCompany(url: string): Promise<{ text: string; name: string }> {
  const base = new URL(url)
  const origin = base.origin

  // Pages to try in order
  const pageCandidates = [
    url,
    `${origin}/about`,
    `${origin}/about-us`,
    `${origin}/ueber-uns`,
    `${origin}/unternehmen`,
    `${origin}/products`,
    `${origin}/produkte`,
    `${origin}/services`,
    `${origin}/leistungen`,
  ]

  const allLines: string[] = []
  let companyName = base.hostname.replace(/^www\./, '')

  let pagesScraped = 0
  for (const pageUrl of pageCandidates) {
    if (pagesScraped >= 3) break

    const html = await fetchPage(pageUrl)
    if (!html) continue

    pagesScraped++
    const lines = extractText(html)

    // Extract company name from first page title
    if (pagesScraped === 1 && lines[0]) {
      const titleLine = lines[0].replace('Firmenname / Seitentitel: ', '')
      // Strip common suffixes like "- Home", "| Home", etc.
      companyName = titleLine.split(/[-|·–]/)[0].trim() || companyName
    }

    allLines.push(...lines)
  }

  // Deduplicate and join
  const seen = new Set<string>()
  const unique = allLines.filter(l => {
    if (seen.has(l)) return false
    seen.add(l)
    return true
  })

  const combined = unique.join('\n')

  // Truncate to ~4500 chars to stay within Claude context budget
  return {
    text: combined.length > 4500 ? combined.slice(0, 4500) + '…' : combined,
    name: companyName,
  }
}

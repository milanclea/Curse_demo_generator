const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'de,en;q=0.8',
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function extractMeta(html: string, name: string): string {
  const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i'))
  return m?.[1]?.trim() ?? ''
}

function extractTitle(html: string): string {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? ''
}

function extractHeadings(html: string): string[] {
  const results: string[] = []
  const re = /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi
  let m
  while ((m = re.exec(html)) !== null) {
    const text = stripTags(m[1]).trim()
    if (text.length > 3 && text.length < 200) results.push(text)
  }
  return results
}

function extractParagraphs(html: string): string[] {
  const results: string[] = []
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi
  let m
  while ((m = re.exec(html)) !== null) {
    const text = stripTags(m[1]).trim()
    if (text.length > 40 && text.length < 600) results.push(text)
  }
  return results
}

function parseHtml(html: string): string[] {
  const lines: string[] = []

  const title = extractTitle(html)
  if (title) lines.push(`Seitentitel: ${title}`)

  const desc = extractMeta(html, 'description') || extractMeta(html, 'og:description')
  if (desc) lines.push(`Beschreibung: ${desc}`)

  lines.push(...extractHeadings(html))
  lines.push(...extractParagraphs(html))

  return lines
}

export async function scrapeCompany(url: string): Promise<{ text: string; name: string }> {
  const base = new URL(url)
  const origin = base.origin

  const pageCandidates = [
    url,
    `${origin}/about`,
    `${origin}/about-us`,
    `${origin}/ueber-uns`,
    `${origin}/unternehmen`,
    `${origin}/products`,
    `${origin}/services`,
  ]

  const allLines: string[] = []
  let companyName = base.hostname.replace(/^www\./, '')
  let pagesScraped = 0

  for (const pageUrl of pageCandidates) {
    if (pagesScraped >= 3) break
    const html = await fetchHtml(pageUrl)
    if (!html) continue

    pagesScraped++
    const lines = parseHtml(html)

    if (pagesScraped === 1 && lines[0]) {
      const raw = lines[0].replace('Seitentitel: ', '')
      const cleaned = raw.split(/[-|·–]/)[0].trim()
      if (cleaned) companyName = cleaned
    }

    allLines.push(...lines)
  }

  const seen = new Set<string>()
  const unique = allLines.filter(l => {
    if (seen.has(l)) return false
    seen.add(l)
    return true
  })

  const combined = unique.join('\n')
  return {
    text: combined.length > 4500 ? combined.slice(0, 4500) + '…' : combined,
    name: companyName,
  }
}

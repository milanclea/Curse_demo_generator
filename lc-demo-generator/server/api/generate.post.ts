import Anthropic from '@anthropic-ai/sdk'
import { scrapeCompany } from '../utils/scraper'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url, language } = body ?? {}

  if (!url) {
    throw createError({ statusCode: 400, message: 'URL ist erforderlich.' })
  }

  // --- Scrape ---
  const { text: companyContent, name: companyName } = await scrapeCompany(url)

  if (!companyContent || companyContent.length < 80) {
    throw createError({
      statusCode: 422,
      message: 'Konnte keine ausreichenden Inhalte von der Website laden. Bitte prüfen Sie die URL.',
    })
  }

  // --- Generate with Claude ---
  const config = useRuntimeConfig()

  if (!config.anthropicApiKey) {
    throw createError({ statusCode: 500, message: 'API-Schlüssel nicht konfiguriert.' })
  }

  const anthropic = new Anthropic({ apiKey: config.anthropicApiKey })

  const prompt = `Du bist ein erfahrener Sprachkursdesigner für die Language Coach Plattform von Langenscheidt.

Basierend auf den folgenden Unternehmensinhalten, erstelle 5 personalisierte Sprachkurs-Templates.
Jeder Kurs soll sehr spezifisch auf die Branche, Produkte und Arbeitsalltag des Unternehmens zugeschnitten sein.

--- UNTERNEHMENS-WEBSITE-INHALT ---
${companyContent}
--- ENDE ---

Zielsprache der Kurse: ${language}

Die 5 Kurse sollen unterschiedliche Kommunikationssituationen abdecken, z.B.:
- Internationale Meetings / Videokonferenzen
- Kundengespräche & Verkauf
- E-Mail-Korrespondenz
- Präsentationen & Pitches
- Verhandlungen & Verträge

Antworte AUSSCHLIESSLICH mit einem gültigen JSON-Array. Kein Text davor, kein Text danach, keine Codeblöcke.
Format: Array mit exakt 5 Objekten, jedes mit diesen Feldern:

{
  "titel": "Kurstitel auf Deutsch (max. 55 Zeichen)",
  "kommunikationssituation": "Konkrete Arbeitssituation im Unternehmen, spezifisch für diese Firma (2-3 Sätze auf Deutsch)",
  "lernziel": "Was Mitarbeiter nach dem Kurs können – beginnt mit 'Die Teilnehmenden können…' (1-2 Sätze auf Deutsch)",
  "vokabular": [
    { "term": "Begriff in ${language}", "translation": "Deutsche Übersetzung" }
  ],
  "phrasen": [
    { "phrase": "Vollständiger Satz in ${language}", "translation": "Deutsche Übersetzung" }
  ]
}

vokabular: 8–10 Einträge, branchenspezifisch
phrasen: 6–8 Einträge, vollständige Sätze die in dieser Firma wirklich gebraucht werden`

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

  // Strip markdown code fences if Claude added them
  const jsonText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  let courses
  try {
    courses = JSON.parse(jsonText)
    if (!Array.isArray(courses) || courses.length === 0) {
      throw new Error('Keine Kurse im Response')
    }
  } catch {
    throw createError({
      statusCode: 500,
      message: 'Fehler beim Verarbeiten der generierten Kurse. Bitte erneut versuchen.',
    })
  }

  return { courses, companyName }
})

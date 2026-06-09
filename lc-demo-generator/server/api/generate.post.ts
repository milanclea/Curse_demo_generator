import Anthropic from '@anthropic-ai/sdk'
import { scrapeCompany } from '../utils/scraper'

const MOCK_COURSES = [
  {
    titel: 'Internationale Meetings erfolgreich leiten',
    kommunikationssituation: 'Ein Vertriebsmitarbeiter leitet ein wöchentliches Statusmeeting mit internationalen Partnern per Videokonferenz. Es geht um Projektfortschritte, Deadlines und nächste Schritte.',
    lernziel: 'Die Teilnehmenden können internationale Meetings strukturiert eröffnen, moderieren und mit einem klaren Action-Plan abschließen.',
    vokabular: [
      { term: 'to chair a meeting', translation: 'ein Meeting leiten' },
      { term: 'agenda', translation: 'Tagesordnung' },
      { term: 'action item', translation: 'Aufgabe / To-do' },
      { term: 'deadline', translation: 'Frist / Abgabetermin' },
      { term: 'follow-up', translation: 'Nachverfolgung' },
      { term: 'to wrap up', translation: 'abschließen / zusammenfassen' },
      { term: 'minutes', translation: 'Protokoll' },
      { term: 'stakeholder', translation: 'Interessenvertreter / Beteiligter' },
    ],
    phrasen: [
      { phrase: "Let's get started — today's agenda covers three main points.", translation: 'Fangen wir an — die heutige Tagesordnung umfasst drei Hauptpunkte.' },
      { phrase: 'Could you give us a quick status update on your end?', translation: 'Können Sie uns kurz den aktuellen Stand bei Ihnen mitteilen?' },
      { phrase: 'I'll send out the meeting minutes by end of day.', translation: 'Ich schicke das Protokoll bis Ende des Tages raus.' },
      { phrase: 'Let's make sure everyone is aligned on the next steps.', translation: 'Stellen wir sicher, dass alle die nächsten Schritte kennen.' },
      { phrase: 'Can we table that discussion for our next call?', translation: 'Können wir das Thema auf das nächste Gespräch vertagen?' },
      { phrase: 'Who is going to own this action item?', translation: 'Wer übernimmt die Verantwortung für diese Aufgabe?' },
    ],
  },
  {
    titel: 'Produkte & Lösungen überzeugend präsentieren',
    kommunikationssituation: 'Ein Account Manager präsentiert das Produktportfolio des Unternehmens einem potenziellen Neukunden in einer 30-minütigen Online-Demo.',
    lernziel: 'Die Teilnehmenden können Produkte und Mehrwerte klar auf Englisch präsentieren, Fragen sicher beantworten und Einwände professionell behandeln.',
    vokabular: [
      { term: 'value proposition', translation: 'Nutzenversprechen' },
      { term: 'key feature', translation: 'Hauptfunktion / zentrales Merkmal' },
      { term: 'use case', translation: 'Anwendungsfall' },
      { term: 'competitive advantage', translation: 'Wettbewerbsvorteil' },
      { term: 'ROI (return on investment)', translation: 'Kapitalrendite' },
      { term: 'scalable', translation: 'skalierbar' },
      { term: 'to integrate', translation: 'integrieren / einbinden' },
      { term: 'pilot project', translation: 'Pilotprojekt' },
    ],
    phrasen: [
      { phrase: "What sets us apart is our focus on simplicity and scalability.", translation: 'Was uns unterscheidet, ist unser Fokus auf Einfachheit und Skalierbarkeit.' },
      { phrase: 'Let me walk you through the key features of our solution.', translation: 'Ich führe Sie durch die wichtigsten Funktionen unserer Lösung.' },
      { phrase: 'This feature directly addresses the challenge you mentioned.', translation: 'Diese Funktion adressiert direkt die Herausforderung, die Sie angesprochen haben.' },
      { phrase: 'Our customers typically see results within the first 90 days.', translation: 'Unsere Kunden sehen typischerweise innerhalb der ersten 90 Tage Ergebnisse.' },
      { phrase: 'Would a pilot project make sense as a first step for you?', translation: 'Wäre ein Pilotprojekt als erster Schritt für Sie sinnvoll?' },
    ],
  },
  {
    titel: 'Professionelle E-Mails auf Englisch verfassen',
    kommunikationssituation: 'Mitarbeitende im Vertrieb und Projektmanagement kommunizieren täglich schriftlich mit internationalen Kunden, Partnern und Lieferanten.',
    lernziel: 'Die Teilnehmenden können klare, höfliche und wirkungsvolle geschäftliche E-Mails auf Englisch verfassen — von der Anfrage bis zur Reklamation.',
    vokabular: [
      { term: 'to reach out', translation: 'sich melden / Kontakt aufnehmen' },
      { term: 'regarding', translation: 'bezüglich' },
      { term: 'to clarify', translation: 'klären / klarstellen' },
      { term: 'attached', translation: 'im Anhang' },
      { term: 'to follow up', translation: 'nachfassen / nachfragen' },
      { term: 'as per our conversation', translation: 'wie in unserem Gespräch besprochen' },
      { term: 'at your earliest convenience', translation: 'so bald wie möglich für Sie' },
      { term: 'further to', translation: 'in Bezug auf / im Anschluss an' },
    ],
    phrasen: [
      { phrase: 'I hope this email finds you well.', translation: 'Ich hoffe, es geht Ihnen gut.' },
      { phrase: 'Please find the requested documents attached.', translation: 'Bitte finden Sie die angeforderten Dokumente im Anhang.' },
      { phrase: 'I wanted to follow up on my previous email from last week.', translation: 'Ich wollte wegen meiner letzten E-Mail von vorletzter Woche nachfragen.' },
      { phrase: 'Could you please confirm receipt of this message?', translation: 'Könnten Sie bitte den Empfang dieser Nachricht bestätigen?' },
      { phrase: 'Please don't hesitate to reach out if you have any questions.', translation: 'Zögern Sie nicht, sich bei Fragen zu melden.' },
      { phrase: 'I look forward to hearing from you.', translation: 'Ich freue mich auf Ihre Rückmeldung.' },
    ],
  },
  {
    titel: 'Verhandlungen & Angebote auf Englisch führen',
    kommunikationssituation: 'Der Einkauf und Vertrieb verhandelt Preise, Konditionen und Vertragsdetails mit englischsprachigen Geschäftspartnern — per Telefon und in Meetings.',
    lernziel: 'Die Teilnehmenden können Verhandlungspositionen klar kommunizieren, Kompromisse vorschlagen und Vereinbarungen auf Englisch verbindlich formulieren.',
    vokabular: [
      { term: 'to negotiate', translation: 'verhandeln' },
      { term: 'terms and conditions', translation: 'Allgemeine Geschäftsbedingungen' },
      { term: 'bulk discount', translation: 'Mengenrabatt' },
      { term: 'lead time', translation: 'Lieferzeit / Vorlaufzeit' },
      { term: 'to compromise', translation: 'einen Kompromiss eingehen' },
      { term: 'binding offer', translation: 'verbindliches Angebot' },
      { term: 'payment terms', translation: 'Zahlungskonditionen' },
      { term: 'to finalize', translation: 'abschließen / fertigstellen' },
    ],
    phrasen: [
      { phrase: 'We're prepared to offer a 10% discount for orders above 500 units.', translation: 'Wir sind bereit, bei Bestellungen über 500 Einheiten 10% Rabatt zu gewähren.' },
      { phrase: 'Can we find a middle ground on the delivery timeline?', translation: 'Können wir uns beim Lieferzeitraum auf einen Kompromiss einigen?' },
      { phrase: 'That's slightly above our budget — is there any flexibility?', translation: 'Das liegt etwas über unserem Budget — gibt es Spielraum?' },
      { phrase: 'We'd need a written confirmation before we can proceed.', translation: 'Wir benötigen eine schriftliche Bestätigung, bevor wir fortfahren können.' },
      { phrase: 'Let's agree on the key points and put them in writing.', translation: 'Lass uns die Kernpunkte festlegen und schriftlich festhalten.' },
    ],
  },
  {
    titel: 'Reklamationen & schwierige Gespräche meistern',
    kommunikationssituation: 'Kundenbetreuer müssen auf Englisch auf Beschwerden, Lieferverzögerungen oder Qualitätsprobleme reagieren — professionell, lösungsorientiert und deeskalierend.',
    lernziel: 'Die Teilnehmenden können Beschwerden auf Englisch empathisch entgegennehmen, Verantwortung übernehmen und konkrete Lösungen kommunizieren.',
    vokabular: [
      { term: 'complaint', translation: 'Beschwerde / Reklamation' },
      { term: 'to escalate', translation: 'eskalieren' },
      { term: 'to acknowledge', translation: 'anerkennen / bestätigen' },
      { term: 'inconvenience', translation: 'Unannehmlichkeit' },
      { term: 'to resolve', translation: 'lösen / beheben' },
      { term: 'refund', translation: 'Rückerstattung' },
      { term: 'goodwill gesture', translation: 'Kulanzgeste' },
      { term: 'root cause', translation: 'Grundursache / eigentlicher Grund' },
    ],
    phrasen: [
      { phrase: 'I completely understand your frustration and I sincerely apologize.', translation: 'Ich verstehe Ihre Frustration vollkommen und entschuldige mich aufrichtig.' },
      { phrase: 'Let me look into this right away and get back to you within the hour.', translation: 'Ich kümmere mich sofort darum und melde mich innerhalb einer Stunde.' },
      { phrase: 'We take full responsibility for this and will make it right.', translation: 'Wir übernehmen die volle Verantwortung dafür und werden es in Ordnung bringen.' },
      { phrase: 'As a goodwill gesture, we'd like to offer you a full refund.', translation: 'Als Kulanzgeste möchten wir Ihnen eine vollständige Erstattung anbieten.' },
      { phrase: 'We've identified the root cause and put measures in place to prevent this in future.', translation: 'Wir haben die Ursache identifiziert und Maßnahmen ergriffen, um dies künftig zu verhindern.' },
    ],
  },
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url, language } = body ?? {}

  if (!url) {
    throw createError({ statusCode: 400, message: 'URL ist erforderlich.' })
  }

  const config = useRuntimeConfig()

  // --- Mock mode: no API key configured ---
  if (!config.anthropicApiKey) {
    // Still scrape to get company name, but skip generation
    await new Promise(r => setTimeout(r, 2000)) // simulate delay
    let companyName = 'Beispiel GmbH'
    try {
      const { name } = await scrapeCompany(url)
      if (name) companyName = name
    } catch {}
    return { courses: MOCK_COURSES, companyName, isMock: true }
  }

  // --- Scrape ---
  const { text: companyContent, name: companyName } = await scrapeCompany(url)

  if (!companyContent || companyContent.length < 80) {
    throw createError({
      statusCode: 422,
      message: 'Konnte keine ausreichenden Inhalte von der Website laden. Bitte prüfen Sie die URL.',
    })
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

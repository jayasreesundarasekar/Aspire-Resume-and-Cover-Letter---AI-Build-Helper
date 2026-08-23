const ACTION_VERBS = ['led', 'built', 'launched', 'designed', 'shipped', 'improved', 'reduced', 'increased',
  'automated', 'optimized', 'created', 'managed', 'drove', 'delivered', 'implemented', 'scaled']

const SECTION_MARKERS = ['experience', 'education', 'skills', 'summary', 'projects', 'contact']

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9+#.]+/g) || [])
}

export function scoreResume(resumeText, jobDescription = '') {
  const text = resumeText || ''
  const lowerText = text.toLowerCase()
  const tokens = new Set(tokenize(text))
  const breakdown = []
  let score = 0

  // 1. Keyword overlap with job description (0-40 pts)
  if (jobDescription.trim()) {
    const jdTokens = tokenize(jobDescription).filter(w => w.length > 3)
    const jdUnique = [...new Set(jdTokens)]
    const matched = jdUnique.filter(w => tokens.has(w))
    const overlapRatio = jdUnique.length ? matched.length / jdUnique.length : 0
    const pts = Math.round(overlapRatio * 40)
    score += pts
    breakdown.push({
      label: 'Keyword match with job description',
      points: pts,
      max: 40,
      detail: `${matched.length}/${jdUnique.length} distinctive keywords found`
    })
  } else {
    breakdown.push({ label: 'Keyword match with job description', points: 0, max: 40, detail: 'Paste a job description to score this' })
  }

  // 2. Section coverage (0-25 pts)
  const sectionsFound = SECTION_MARKERS.filter(s => lowerText.includes(s))
  const sectionPts = Math.round((sectionsFound.length / SECTION_MARKERS.length) * 25)
  score += sectionPts
  breakdown.push({
    label: 'Standard sections present',
    points: sectionPts,
    max: 25,
    detail: `${sectionsFound.length}/${SECTION_MARKERS.length} found: ${sectionsFound.join(', ') || 'none'}`
  })

  // 3. Action verbs (0-15 pts)
  const verbHits = ACTION_VERBS.filter(v => tokens.has(v))
  const verbPts = Math.min(15, verbHits.length * 3)
  score += verbPts
  breakdown.push({
    label: 'Strong action verbs',
    points: verbPts,
    max: 15,
    detail: `${verbHits.length} distinct action verbs used`
  })

  // 4. Quantified impact — numbers/percent signs near bullets (0-10 pts)
  const numberHits = (text.match(/\d+%|\$\d+|\d+x|\d+\+/g) || []).length
  const numPts = Math.min(10, numberHits * 2)
  score += numPts
  breakdown.push({
    label: 'Quantified impact (%, $, x, +)',
    points: numPts,
    max: 10,
    detail: `${numberHits} quantified results found`
  })

  // 5. Length sanity (0-10 pts)
  const wordCount = tokens.size ? text.trim().split(/\s+/).length : 0
  const lenPts = wordCount >= 250 && wordCount <= 900 ? 10 : wordCount > 0 ? 5 : 0
  score += lenPts
  breakdown.push({
    label: 'Resume length',
    points: lenPts,
    max: 10,
    detail: `${wordCount} words (ideal: 250–900)`
  })

  return { score: Math.min(100, score), breakdown }
}

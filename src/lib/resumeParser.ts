import PDFParser from 'pdf-parse'
import mammoth from 'mammoth'
import { CandidateInfo } from '../types'

export async function parseResume(file: File): Promise<Partial<CandidateInfo>> {
  let text = ''

  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer()
    const data = await PDFParser(Buffer.from(arrayBuffer))
    text = data.text
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    text = result.value
  } else {
    throw new Error('Unsupported file format')
  }

  return extractCandidateInfo(text)
}

function extractCandidateInfo(text: string): Partial<CandidateInfo> {
  const info: Partial<CandidateInfo> = {}

  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  const emailMatch = text.match(emailRegex)
  if (emailMatch) {
    info.email = emailMatch[0]
  }

  // Extract phone
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  const phoneMatch = text.match(phoneRegex)
  if (phoneMatch) {
    info.phone = phoneMatch[0]
  }

  // Extract name (first line or lines before email/phone)
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  for (const line of lines) {
    // Skip lines that are just email or phone
    if (emailRegex.test(line) || phoneRegex.test(line)) continue
    
    // Check if line looks like a name (2-4 words, mostly alphabetic)
    const words = line.split(/\s+/)
    if (words.length >= 2 && words.length <= 4) {
      const isName = words.every(word => /^[A-Za-z]+$/.test(word))
      if (isName) {
        info.name = line
        break
      }
    }
  }

  return info
}
const ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&ldquo;': '\u201C',
  '&rdquo;': '\u201D',
  '&lsquo;': '\u2018',
  '&rsquo;': '\u2019',
  '&hellip;': '\u2026',
  '&mdash;': '\u2014',
  '&ndash;': '\u2013',
}

export function decodeHtml(text: string): string {
  let decoded = text.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(Number(code)),
  )
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  )
  decoded = decoded.replace(
    /&[a-zA-Z]+;/g,
    (entity) => ENTITY_MAP[entity] ?? entity,
  )
  return decoded
}

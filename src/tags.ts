export const TAGS = [
  { value: 'centru', label: 'Pe centru', emoji: '🏙️' },
  { value: 'langa-centru', label: 'Pe lângă centru', emoji: '🏘️' },
  { value: 'satelit', label: 'In pula cu satelitu', emoji: '🛸' },
] as const

export type TagValue = (typeof TAGS)[number]['value']

export function getTag(value?: string) {
  return TAGS.find((t) => t.value === value)
}

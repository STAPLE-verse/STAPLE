export const MAX_SET_LABELS = 50
export const MAX_SET_TASKS = 100
export const MAX_NEW_TASKS = 500

// One label per line, e.g. "Interview 2". Blank lines and repeats are dropped.
export const parseLabels = (text: string): string[] => {
  const seen = new Set<string>()
  const labels: string[] = []
  for (const line of text.split(/\r?\n/)) {
    const label = line.trim()
    if (label && !seen.has(label.toLowerCase())) {
      seen.add(label.toLowerCase())
      labels.push(label)
    }
  }
  return labels
}

// "Transcribe" for "Interview 2" is "Transcribe - Interview 2"
export const taskNameForLabel = (taskName: string, label: string): string =>
  `${taskName} - ${label}`

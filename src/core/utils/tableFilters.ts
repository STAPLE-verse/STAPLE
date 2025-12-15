import { FilterFn } from "@tanstack/react-table"

type DateLike = Date | string | number | null | undefined

type DateFilterOptions = {
  emptyLabel?: string
  locale?: string
}

const DEFAULT_LOCALE = "en-US"
const MAX_RECURSION_DEPTH = 5

const parseDateLike = (value: DateLike): Date | null => {
  if (value instanceof Date) {
    return value
  }

  if (typeof value === "number") {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value)
    if (Number.isNaN(parsed)) {
      return null
    }
    const date = new Date(parsed)
    return Number.isNaN(date.getTime()) ? null : date
  }

  return null
}

export const buildDateSearchValue = (value: DateLike, options?: DateFilterOptions): string => {
  const emptyLabel = options?.emptyLabel ?? "no date"
  const locale = options?.locale ?? DEFAULT_LOCALE

  if (value === null || value === undefined || value === "") {
    return emptyLabel.toLowerCase()
  }

  const date = parseDateLike(value)
  if (!date) {
    return ""
  }

  const iso = date.toISOString().split("T")[0]
  const longDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
  const shortDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)

  return `${iso} ${longDate.toLowerCase()} ${shortDate.toLowerCase()}`.trim()
}

export const createDateTextFilter = (options?: DateFilterOptions): FilterFn<any> => {
  return (row, columnId, filterValue) => {
    const searchValue = String(filterValue ?? "")
      .trim()
      .toLowerCase()

    if (!searchValue) {
      return true
    }

    const rawValue = row.getValue(columnId) as DateLike
    const searchableDate = buildDateSearchValue(rawValue, options)

    if (!searchableDate) {
      return false
    }

    return searchableDate.includes(searchValue)
  }
}

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object") {
    return false
  }
  return Object.getPrototypeOf(value) === Object.prototype
}

const describePrimitive = (value: unknown, locale: string, keyHint?: string): string => {
  if (value === null || value === undefined) {
    return ""
  }

  if (value instanceof Date) {
    return buildDateSearchValue(value, { emptyLabel: "", locale })
  }

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) {
      return ""
    }

    const parsedDate = parseDateLike(value)
    if (parsedDate) {
      const formatted = buildDateSearchValue(parsedDate, { emptyLabel: "", locale })
      return `${trimmed.toLowerCase()} ${formatted}`.trim()
    }

    return trimmed.toLowerCase()
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return String(value)
  }

  if (typeof value === "boolean") {
    const normalizedKey = keyHint?.toLowerCase() ?? ""
    if (normalizedKey.includes("read")) {
      return value ? "read true yes" : "unread false no"
    }
    return value ? "true yes" : "false no"
  }

  return ""
}

export const buildSearchableString = (
  value: unknown,
  options?: {
    locale?: string
  }
): string => {
  const locale = options?.locale ?? DEFAULT_LOCALE
  const visited = new WeakSet<object>()

  const helper = (input: unknown, depth: number, keyHint?: string): string => {
    if (depth > MAX_RECURSION_DEPTH) {
      return ""
    }

    if (input === null || input === undefined) {
      return ""
    }

    if (input instanceof Date || typeof input !== "object") {
      return describePrimitive(input, locale, keyHint)
    }

    if (visited.has(input as object)) {
      return ""
    }

    visited.add(input as object)
    let result = ""

    if (Array.isArray(input)) {
      result = input.map((item) => helper(item, depth + 1, keyHint)).join(" ")
    } else if (isPlainObject(input)) {
      result = Object.entries(input)
        .map(([key, item]) => helper(item, depth + 1, key))
        .join(" ")
    } else {
      // Non-plain objects (e.g., Maps) fallback to string conversion
      result = describePrimitive(String(input), locale, keyHint)
    }

    visited.delete(input as object)
    return result.trim()
  }

  return helper(value, 0).trim().toLowerCase()
}

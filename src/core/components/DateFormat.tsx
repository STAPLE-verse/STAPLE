import { useCurrentUser } from "src/users/hooks/useCurrentUser"

interface DateFormatProps {
  date?: Date | string | number | null
  /**
   * full: previous default (date + time)
   * date: month long + day + year
   * dateShort: month short + day + year (good for tables)
   */
  preset?: "full" | "date" | "dateShort"
  /** Optional locale override; defaults to the current user's language */
  locale?: string
}

export default function DateFormat({ date, preset = "full", locale: localeProp }: DateFormatProps) {
  const currentUser = useCurrentUser()
  const locale = localeProp || (currentUser ? currentUser.language : "en-US")

  if (date == null) return <></>

  const d = date instanceof Date ? date : new Date(date)

  const presets: Record<NonNullable<DateFormatProps["preset"]>, Intl.DateTimeFormatOptions> = {
    full: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
    date: {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    dateShort: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  }

  const options = presets[preset] ?? presets.full

  return <>{new Intl.DateTimeFormat(locale, options).format(d)}</>
}

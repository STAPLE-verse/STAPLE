import { useCurrentUser } from "src/users/hooks/useCurrentUser"

interface DateFormatProps {
  date?: Date | null
}

export default function DateFormat({ date }: DateFormatProps) {
  const currentUser = useCurrentUser()
  const locale = currentUser ? currentUser.language : "en-US"

  return (
    <span>
      {" "}
      {date
        ? date.toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // Use 24-hour format
          })
        : ""}
    </span>
  )
}

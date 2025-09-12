import React from "react"
import DateFormat from "./DateFormat"

export interface DateRangeProps {
  /** A start date, e.g. milestone.startDate or task.startDate */
  start?: Date | null
  /** An end date, e.g. milestone.endDate or task.deadline */
  end?: Date | null
  /** Text when neither date is present */
  emptyText?: string
  /** Optional wrapper className */
  className?: string
}

const DateRange: React.FC<DateRangeProps> = ({
  start,
  end,
  emptyText = "No date set",
  className,
}) => {
  if (start && end) {
    return (
      <span className={className}>
        From <DateFormat date={start} /> to <DateFormat date={end} />
      </span>
    )
  }
  if (start) {
    return (
      <span className={className}>
        Start: <DateFormat date={start} />
      </span>
    )
  }
  if (end) {
    return (
      <span className={className}>
        End: <DateFormat date={end} />
      </span>
    )
  }
  return <span className={className}>{emptyText}</span>
}

export default DateRange

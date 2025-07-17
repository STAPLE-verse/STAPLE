import { Tooltip } from "react-tooltip"
import { useTooltip } from "./TooltipContext"
import type { ComponentProps } from "react"

type TooltipWrapperProps = ComponentProps<typeof Tooltip>

const TooltipWrapper = (props: TooltipWrapperProps) => {
  const { enabled } = useTooltip()

  if (!enabled) return null

  return <Tooltip {...props} />
}

export default TooltipWrapper

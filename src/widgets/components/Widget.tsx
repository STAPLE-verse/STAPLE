import { WidgetSize } from "@prisma/client"
import React from "react"
import TooltipWrapper from "src/core/components/TooltipWrapper"

interface WidgetProps {
  title: string
  display: React.ReactNode
  tooltipId: string
  tooltipContent: string
  link: React.ReactNode
  size?: WidgetSize
}

const Widget: React.FC<WidgetProps> = ({
  title,
  display,
  tooltipId,
  tooltipContent,
  link,
  size,
}) => {
  return (
    <div
      className={`card-body flex flex-col ${
        size === WidgetSize.SMALL ? "p-4" : size === WidgetSize.LARGE ? "p-6" : "p-5"
      }`}
    >
      <div
        className="card-title text-base-content mb-2 overflow-visible"
        data-tooltip-id={tooltipId}
      >
        {title}
      </div>
      <div className="flex-grow overflow-auto flex align-center">{display}</div>
      <TooltipWrapper
        id={tooltipId}
        content={tooltipContent}
        className="z-[9999] ourtooltips"
        place="top"
      />
      <div className="card-actions mt-auto justify-end">{link}</div>
    </div>
  )
}

export default Widget

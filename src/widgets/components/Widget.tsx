import { WidgetSize } from "@prisma/client"
import React from "react"
import TooltipWrapper from "src/core/components/TooltipWrapper"
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline"

interface WidgetProps {
  title: string
  display: React.ReactNode
  tooltipId: string
  tooltipContent: string
  link: React.ReactNode
  size?: WidgetSize
  hasNewComments?: boolean
}

const Widget: React.FC<WidgetProps> = ({
  title,
  display,
  tooltipId,
  tooltipContent,
  link,
  size,
  hasNewComments,
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
        <div className="flex items-center justify-between w-full gap-2">
          <span>{title}</span>
          {hasNewComments && <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-primary" />}
        </div>
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

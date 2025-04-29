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
  newCommentsCount?: number
}

const Widget: React.FC<WidgetProps> = ({
  title,
  display,
  tooltipId,
  tooltipContent,
  link,
  size,
  hasNewComments,
  newCommentsCount,
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
          {typeof newCommentsCount !== "undefined" && (
            <div className="relative flex items-center justify-center w-fit">
              <ChatBubbleOvalLeftEllipsisIcon
                className={`h-7 w-7 ${newCommentsCount > 0 ? "text-primary" : "opacity-30"}`}
              />
              {newCommentsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-error text-xs text-white flex items-center justify-center">
                  {newCommentsCount}
                </span>
              )}
            </div>
          )}
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

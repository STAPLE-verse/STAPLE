import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import TooltipWrapper from "src/core/components/TooltipWrapper"

interface CircularPercentageWidgetProps {
  data: number
  title: string
  tooltip: string
  noData: boolean
  noDataText?: string
}

export const CircularPercentageWidget: React.FC<CircularPercentageWidgetProps> = ({
  data,
  title,
  tooltip,
  noData,
  noDataText,
}) => {
  return (
    <div className="stat place-items-center">
      <div className="stat-title text-2xl text-inherit" data-tooltip-id={`${title}-tooltip`}>
        {title}
      </div>
      <TooltipWrapper id={`${title}-tooltip`} content={tooltip} className="z-[1099] ourtooltips" />
      {noData ? (
        noDataText
      ) : (
        <>
          <div className="w-20 h-20 m-2">
            <CircularProgressbar
              value={data * 100}
              text={`${Math.round(data * 100)}%`}
              strokeWidth={8}
              background={false}
              backgroundPadding={0}
              circleRatio={1}
              maxValue={100}
              minValue={0}
              counterClockwise={false}
              className=""
              classes={{
                root: "CircularProgressbar",
                path: "CircularProgressbar-path",
                trail: "CircularProgressbar-trail",
                text: "CircularProgressbar-text",
                background: "CircularProgressbar-background",
              }}
              styles={buildStyles({
                textSize: "16px",
                pathTransitionDuration: 0,
                pathColor: "oklch(var(--p))",
                textColor: "oklch(var(--s))",
                trailColor: "oklch(var(--pc))",
                backgroundColor: "oklch(var(--b3))",
              })}
            />
          </div>
        </>
      )}
    </div>
  )
}

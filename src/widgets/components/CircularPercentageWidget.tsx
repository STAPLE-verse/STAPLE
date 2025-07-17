import { GetCircularProgressDisplay } from "src/core/components/GetWidgetDisplay"
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
            <GetCircularProgressDisplay proportion={data} />
          </div>
        </>
      )}
    </div>
  )
}

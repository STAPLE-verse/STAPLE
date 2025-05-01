import { PieChart } from "react-minimal-pie-chart"
import TooltipWrapper from "src/core/components/TooltipWrapper"

interface PieChartWidgetProps {
  data: { title: string; value: number; color: string }[] // Data format for the pie chart
  title: string
  tooltip: string
  noData: boolean
  noDataText?: string
}

export const PieChartWidget: React.FC<PieChartWidgetProps> = ({
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
          <div className="w-40 h-40 m-2">
            <PieChart
              data={data}
              lineWidth={60}
              rounded
              label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value}`}
              labelStyle={{
                fontSize: "5px",
                fontFamily: "Arial",
                fill: "#fff",
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

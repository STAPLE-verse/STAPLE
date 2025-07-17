import { PieChart } from "react-minimal-pie-chart"
import { Tooltip } from "react-tooltip"
import { useState } from "react"

interface PieChartWidgetProps {
  data: { label: string; value: number; color: string }[] // Data format for the pie chart
  titleWidget: string
  tooltip: string
  noData: boolean
  noDataText?: string
}

export const PieChartWidget: React.FC<PieChartWidgetProps> = ({
  data,
  titleWidget,
  tooltip,
  noData,
  noDataText,
}) => {
  const [hoveredSegment, setHoveredSegment] = useState(null)

  const handleMouseOver = (event, dataIndex) => {
    setHoveredSegment(dataIndex)
  }

  const handleMouseOut = () => {
    setHoveredSegment(null)
  }

  return (
    <div className="stat place-items-center">
      <div className="stat-title text-2xl text-inherit" data-tooltip-id="titleWidgetTooltip">
        {titleWidget}
      </div>
      <Tooltip id="titleWidgetTooltip" className="z-[1099] ourtooltips" content={tooltip} />

      {noData ? (
        noDataText
      ) : (
        <>
          <div className="w-20 h-20 m-2" data-tip="" data-for="chart">
            <PieChart
              data={data}
              radius={50}
              lineWidth={40}
              rounded
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              segmentsStyle={(index) => ({
                transition: "opacity 300ms",
                opacity: hoveredSegment === null || hoveredSegment === index ? 1 : 0.5,
              })}
            />
            {hoveredSegment !== null && (
              <div
                className="ourtooltips"
                style={{
                  position: "absolute", // Make sure the tooltip is positioned relative to the chart
                  padding: "5px 10px", // Add padding for spacing
                  borderRadius: "5px", // Round corners for the tooltip
                  textAlign: "center", // Align the text in the center
                }}
              >
                {`${data[hoveredSegment]!.label}: ${data[hoveredSegment]!.value}`}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

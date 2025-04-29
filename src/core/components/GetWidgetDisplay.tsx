import Table from "src/core/components/Table"
import { projectManagersColumns } from "src/widgets/components/ColumnHelpers"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import DateFormat from "./DateFormat"

// use for all tables in widgets
export function GetTableDisplay({ data, columns, type }) {
  if (data.length === 0) {
    return <p className="italic mb-2">No {type}</p>
  }
  return (
    <Table
      columns={columns}
      data={data}
      classNames={{
        thead: "text-base text-base-content",
        tbody: "text-base text-base-content",
        td: "text-base text-base-content",
      }}
    />
  )
}

//use for all circular task bars
export function GetCircularProgressDisplay({ proportion }) {
  return (
    <div className="flex flex-grow justify-center items-center font-bold text-3xl size-circle">
      <CircularProgressbar
        value={proportion * 100}
        text={`${Math.round(proportion * 100)}%`}
        strokeWidth={8}
        maxValue={100}
        minValue={0}
        background={false}
        backgroundPadding={0}
        className=""
        counterClockwise={false}
        circleRatio={1}
        //pass the defaults here so it stops complaining
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
          textColor: "oklch(var(--p))",
          trailColor: "oklch(var(--pc))",
          backgroundColor: "oklch(var(--b3))",
        })}
      />
    </div>
  )
}

//use for all simple icon displays
export function GetIconDisplay({ number, icon: Icon }) {
  return (
    <div className="flex flex-grow justify-center items-center font-bold text-3xl size-circle">
      {number}
      <Icon className="w-20" />
    </div>
  )
}

export function GetProjectSummaryDisplay({ project, projectManagers }) {
  return (
    <div>
      {project.description}
      <p className="italic">
        Last update: <DateFormat date={project.updatedAt}></DateFormat>
      </p>

      <p className="font-bold mt-4">Contacts for the Project: </p>
      <Table
        columns={projectManagersColumns}
        data={projectManagers}
        classNames={{
          thead: "text-base",
          tbody: "text-base",
          td: "text-base",
        }}
      />
    </div>
  )
}

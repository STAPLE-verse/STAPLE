import React, { useState } from "react"

import getContributors from "src/contributors/queries/getContributors"
// import getColumns from "../queries/getColumns"
import getElements from "src/elements/queries/getElements"
import { useQuery } from "@blitzjs/rpc"

type Props = {
  taskId?: number
  projectId?: number
}

const AssignContributors = ({ taskId, projectId }: Props) => {
  //needs tp get task name
  const taskName = "DefaultName"

  const [{ contributors }] = useQuery(getContributors, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    include: {
      user: true,
    },
  })

  const contributorOptions = contributors.map((contributor) => ({
    firstName: contributor["user"].firstName,
    lastName: contributor["user"].lastName,
    id: contributor["user"].id,
  }))

  //TODO needs to set the initial status based on if have been assigned previosly
  const [contributorChecked, setcontributorChecked] = useState(
    new Array(contributorOptions.length).fill(false)
  )

  const handleOnChange = (position) => {
    const updatedCheckedState = contributorChecked.map((item, index) =>
      index === position ? !item : item
    )

    setcontributorChecked(updatedCheckedState)
  }

  return (
    <div>
      <div className="flex  mt-2">
        Assign contributors to task: <span className="font-bold px-1"> {taskName}</span>
      </div>
      <div>
        <ul>
          {contributorOptions &&
            contributorOptions.map((val, index) => {
              return (
                <li key={val.id} className="flex  mt-1">
                  <div>
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={contributorChecked[index]}
                        onChange={() => handleOnChange(index)}
                      />
                      <span className="label-text px-2">
                        {val.firstName} {val.lastName}
                      </span>
                    </label>
                  </div>
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}

export default AssignContributors

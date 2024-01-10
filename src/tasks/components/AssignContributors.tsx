import React, { useState } from "react"

import getContributors from "src/contributors/queries/getContributors"
import createAssignment from "src/assignments/mutations/createAssignment"
// import getColumns from "../queries/getColumns"
import getElements from "src/elements/queries/getElements"
import { useMutation, useQuery } from "@blitzjs/rpc"

type Props = {
  taskId?: number
  projectId?: number
}

const AssignContributors = ({ taskId, projectId }: Props) => {
  //needs tp get task name
  const taskName = "DefaultName"

  const [createAssigmentMutation] = useMutation(createAssignment)

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
  //Also needs to get assigments in case some one is unchecked from current assigment ,
  //then needs to delete assigment from database
  const [contributorChecked, setcontributorChecked] = useState(
    new Array(contributorOptions.length).fill(false)
  )

  const handleOnChange = (position) => {
    const updatedCheckedState = contributorChecked.map((item, index) =>
      index === position ? !item : item
    )

    setcontributorChecked(updatedCheckedState)
  }
  const saveContributorsList = () => {
    contributorChecked.forEach(async (checked, index) => {
      let contributorId
      //TODO check if a previous assigment exist
      if (contributorOptions != undefined) {
        contributorId = contributorOptions[index]!["id"]
      }

      console.log(contributorId)
      if (checked) {
        //if does not exist create assigment
        try {
          const task = await createAssigmentMutation({
            taskId: taskId!,
            contributorId: contributorId,
          })
        } catch (error: any) {
          console.error(error)
        }
      } else {
        //delete if previous assigment exist
      }
    })
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
                <li key={index} className="flex  mt-1">
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

      <button className="btn btn-primary" onClick={() => saveContributorsList()}>
        Save
      </button>
    </div>
  )
}

export default AssignContributors

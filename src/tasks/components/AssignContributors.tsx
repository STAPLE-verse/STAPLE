import React, { useState } from "react"

// import getContributors from "src/contributors/queries/getContributors"
// import createAssignment from "src/assignments/mutations/createAssignment"
// import getColumns from "../queries/getColumns"
import getElements from "src/elements/queries/getElements"
// import { useMutation, useQuery } from "@blitzjs/rpc"
// import { T } from "@blitzjs/auth/dist/index-19e2d23c"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Table from "src/core/components/Table"

export type ContributorOption = {
  userName: string
  firstName: string
  lastName: string
  id: number
  checked: boolean
}

const columnHelper = createColumnHelper<ContributorOption>()

type Props = {
  onChange?: (selected: any) => void
  contributorOptions: ContributorOption[]
}

// With Table, needs
//onClose event for this , with call be a modal
//then when input changes, get all selected rows from table which returns model
//all get selected rows on each change

const AssignContributors = ({ onChange, contributorOptions }: Props) => {
  //TODO needs to set the initial status based on if have been assigned previosly
  //Also needs to get assigments in case some one is unchecked from current assigment ,
  //then needs to delete assigment from database
  const [contributorChecked, setcontributorChecked] = useState(contributorOptions)

  const handleOnChange = (element) => {
    const updatedCheckedState = contributorChecked.map((item, index) => {
      let t = item
      if (item.id === element.id) {
        t.checked = !t.checked
      }
      return t
    })
    // let temp = contributorOptions.findIndex((x) => x.id == element.id)
    // console.log(temp)

    setcontributorChecked(updatedCheckedState)
    if (onChange != undefined) {
      onChange(updatedCheckedState)
    }
  }

  // ColumnDefs
  const contributorTableColumns: ColumnDef<ContributorOption>[] = [
    columnHelper.accessor("id", {
      cell: (info) => (
        <span>
          {
            <div>
              <label className="label cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={info.row.original.checked}
                  onChange={() => {
                    handleOnChange(info.row.original)
                  }}
                />
              </label>
            </div>
          }
        </span>
      ),
      header: "",
    }),

    columnHelper.accessor("firstName", {
      cell: (info) => (
        <span>{`${info.row.original.firstName}  ${info.row.original.lastName}`}</span>
      ),
      header: "Contributor Name",
    }),
  ]

  return (
    <div>
      <div className="flex  mt-2 font-bold">Assign contributors to task</div>
      <div>
        {/* <ul>
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
                        {val?.firstName} {val?.userName}
                      </span>
                    </label>
                  </div>
                </li>
              )
            })}
        </ul> */}
      </div>
      <Table columns={contributorTableColumns} data={contributorChecked}></Table>

      {/* <button className="btn btn-primary" onClick={() => saveContributorsList()}>
        Save
      </button> */}
    </div>
  )
}

export default AssignContributors

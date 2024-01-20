import React, { useState } from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Table from "src/core/components/Table"

export type TeamOption = {
  userName: string
  id: number
  checked: boolean
  teamId?: number
}

const columnHelper = createColumnHelper<TeamOption>()

type Props = {
  onChange?: (selected: any) => void
  teamOptions: TeamOption[]
}

const AssignTeamMembers = ({ onChange, teamOptions }: Props) => {
  const [contributorChecked, setcontributorChecked] = useState(teamOptions)

  // const handleOnChange = (element) => {
  //   let needsUpdate: any[] = []
  //   const updatedCheckedState = contributorChecked.map((item, index) => {
  //     let t = item
  //     if (item.id === element.id) {
  //       t.checked = !t.checked
  //     }
  //     return t
  //   })

  //   //only update the items that changed
  //   updatedCheckedState.forEach((element) => {
  //     let orgItem = contributorOptions.find((orgItem) => orgItem.id == element.id)

  //     if (orgItem != undefined && orgItem.checked != element.checked) {
  //       needsUpdate.push({
  //         id: element.id,
  //         checked: element.checked,
  //         assigmentId: element.assigmentId,
  //       })
  //     }
  //   })

  //   setcontributorChecked(updatedCheckedState)
  //   if (onChange != undefined) {
  //     console.log("update from contributors")
  //     onChange(needsUpdate)
  //   }
  // }

  // ColumnDefs
  const contributorTableColumns: ColumnDef<TeamOption>[] = [
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
                    // handleOnChange(info.row.original)
                  }}
                />
              </label>
            </div>
          }
        </span>
      ),
      header: "",
    }),

    columnHelper.accessor("userName", {
      cell: (info) => <span>{`${info.row.original.userName}`}</span>,
      header: "UserName",
    }),
  ]

  return (
    <div>
      <div className="flex  mt-2 font-bold">Team Members</div>
      <Table columns={contributorTableColumns} data={contributorChecked}></Table>
    </div>
  )
}

export default AssignTeamMembers

import React, { useState } from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Table from "src/core/components/Table"

export type TeamOption = {
  name: string
  id: number
  checked: boolean
  assigmentId?: number
}

const columnHelper = createColumnHelper<TeamOption>()

type Props = {
  onChange?: (selected: any) => void
  teamOptions: TeamOption[]
}

const AssignTeams = ({ onChange, teamOptions }: Props) => {
  const [teamChecked, setTeamChecked] = useState(teamOptions)

  const handleOnChange = (element) => {
    const updatedCheckedState =
      teamChecked == undefined
        ? []
        : teamChecked.map((item, index) => {
            let t = item
            if (item.id === element.id) {
              t.checked = !t.checked
            }
            return t
          })

    if (onChange != undefined) {
      onChange(updatedCheckedState)
    }
  }

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

    columnHelper.accessor("name", {
      cell: (info) => <span>{`${info.row.original.name}`}</span>,
      header: "Team name",
    }),
  ]

  return (
    <div>
      <div className="flex mt-2 font-bold">Assign Team to task</div>
      <Table columns={contributorTableColumns} data={teamChecked}></Table>
    </div>
  )
}

export default AssignTeams

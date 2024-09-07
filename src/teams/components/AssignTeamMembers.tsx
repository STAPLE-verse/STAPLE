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
  showCheckbox: boolean
}

//TODO refactor this table: checkboxfield is available at other places. e.g. see TaskForm for Team selection
const AssignTeamMembers = ({ onChange, teamOptions, showCheckbox }: Props) => {
  const [contributorChecked, setcontributorChecked] = useState(teamOptions)
  const handleOnChange = (element) => {
    const updatedCheckedState = contributorChecked.map((item, index) => {
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
  const contributorTableColumns: ColumnDef<TeamOption>[] = []

  if (showCheckbox) {
    contributorTableColumns.push(
      columnHelper.accessor("id", {
        cell: (info) => (
          <span>
            {
              <div>
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary border-2"
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
        header: "Select",
      })
    )
  }
  contributorTableColumns.push(
    columnHelper.accessor("userName", {
      cell: (info) => <span>{`${info.row.original.userName}`}</span>,
      header: "User Name",
    })
  )

  return (
    <div>
      <div className="flex">
        <style jsx>{`
          label {
            display: flex;
            flex-direction: column;
            align-items: start;
            font-size: 1.25rem;
          }
          input {
            font-size: 1rem;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            appearance: none;
          }
        `}</style>
        <label>Add Team Members:</label>
      </div>
      <Table
        columns={contributorTableColumns}
        data={contributorChecked}
        addPagination={true}
      ></Table>
    </div>
  )
}

export default AssignTeamMembers

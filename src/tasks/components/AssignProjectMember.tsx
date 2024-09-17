import React, { useState } from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Table from "src/core/components/Table"

export type ContributorOption = {
  userName: string
  firstName: string
  lastName: string
  id: number
  checked: boolean
  assignmentId?: number
}

const columnHelper = createColumnHelper<ContributorOption>()

type Props = {
  onChange?: (selected: any) => void
  projectMemberOptions: ContributorOption[]
}

const AssignContributors = ({ onChange, projectMemberOptions }: Props) => {
  const [projectMemberChecked, setprojectMemberChecked] = useState(projectMemberOptions)

  const handleOnChange = (element) => {
    const updatedCheckedState = projectMemberChecked.map((item, index) => {
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
  const projectMemberTableColumns: ColumnDef<ContributorOption>[] = [
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
      header: "",
    }),

    columnHelper.accessor("userName", {
      cell: (info) => <span>{`${info.row.original.userName}`}</span>,
      header: "Contributor Username",
    }),
  ]

  return (
    <div>
      <div className="flex mt-2 font-bold">Assign Contributors to Task</div>
      <Table
        columns={projectMemberTableColumns}
        data={projectMemberChecked}
        addPagination={true}
      ></Table>
    </div>
  )
}

export default AssignContributors

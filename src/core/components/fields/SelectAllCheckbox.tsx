import { useMultiSelect } from "./MultiSelectContext"

export const SelectAllCheckbox = ({ allIds }: { allIds: number[] }) => {
  const { selectedIds, handleBulkSelection } = useMultiSelect()

  const isAllSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))
  const isIndeterminate = selectedIds.length > 0 && !isAllSelected

  return (
    <label className="label cursor-pointer">
      <input
        type="checkbox"
        className="checkbox checkbox-secondary border-2"
        checked={isAllSelected}
        ref={(el) => {
          if (el) el.indeterminate = isIndeterminate
        }}
        onChange={() => handleBulkSelection(allIds, !isAllSelected)}
      />
    </label>
  )
}

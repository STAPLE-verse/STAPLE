import { useMultiSelect } from "./MultiSelectContext"

export const SelectAllCheckbox = ({ allIds }: { allIds: number[] }) => {
  const { selectedIds, handleBulkSelection, isGlobalSelection, disableGlobalSelection } =
    useMultiSelect()

  const isPageSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))
  const isAllSelected = isGlobalSelection || isPageSelected
  const isIndeterminate = !isGlobalSelection && selectedIds.length > 0 && !isPageSelected

  return (
    <label className="label cursor-pointer">
      <input
        type="checkbox"
        className="checkbox checkbox-secondary border-2"
        checked={isAllSelected}
        disabled={isGlobalSelection}
        ref={(el) => {
          if (el) el.indeterminate = isIndeterminate
        }}
        onChange={() => {
          if (isGlobalSelection) {
            disableGlobalSelection()
          } else {
            handleBulkSelection(allIds, !isPageSelected)
          }
        }}
      />
    </label>
  )
}

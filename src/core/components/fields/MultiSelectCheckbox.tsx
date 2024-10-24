import { useMultiSelect } from "./MultiSelectContext"

export const MultiSelectCheckbox = ({ id }) => {
  const { selectedIds, handleSelection } = useMultiSelect()

  return (
    <div>
      <span>
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-primary border-2"
            checked={selectedIds.includes(id)}
            onChange={() => handleSelection(id)}
          />
        </label>
      </span>
    </div>
  )
}

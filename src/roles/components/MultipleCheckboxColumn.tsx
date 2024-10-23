export const MultipleCheckboxColumn = ({ row }) => {
  const handleOnChange = (id) => {
    if (row.onMultipledAdded != undefined) {
      row.onMultipledAdded(id)
    }
  }
  console.log(row.selectedIds)
  return (
    <div>
      <span>
        {
          <div>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary border-2"
                checked={row.selectedIds.includes(row.id)}
                onChange={() => {
                  handleOnChange(row.id)
                }}
              />
            </label>
          </div>
        }
      </span>
    </div>
  )
}

export const LabelsColumn = ({ row }) => {
  const labels = row.labels || []

  const text = labels.map((label) => label.name).join("<br>") // Join labels with a newline character

  return <div dangerouslySetInnerHTML={{ __html: text }}></div>
}

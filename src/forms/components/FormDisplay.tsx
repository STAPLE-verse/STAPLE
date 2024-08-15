export default function FormDisplay({ theadData, tbodyData }) {
  return (
    <table>
      <thead>
        <tr>
          {theadData.map((heading) => {
            return <th key={heading}>{heading}</th>
          })}
        </tr>
      </thead>
      <tbody>
        {tbodyData.map((row, index) => {
          return (
            <tr key={index}>
              {theadData.map((key, index) => {
                return <td key={row[key]}>{row[key]}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

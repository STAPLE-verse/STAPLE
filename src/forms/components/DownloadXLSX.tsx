import React from "react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

function DownloadXLSX({ data, fileName, className }) {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    })

    saveAs(blob, `${fileName}.xlsx`)
  }

  return (
    <button className={className} onClick={exportToExcel}>
      Download XLSX
    </button>
  )
}

export default DownloadXLSX

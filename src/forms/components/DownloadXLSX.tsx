import React from "react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

interface DownloadXLSXProps {
  data: any
  fileName: string
  type?: "button" | "submit" | "reset" // Match the allowed types
  className?: string
}

function DownloadXLSX({ data, fileName, type = "button", className }: DownloadXLSXProps) {
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
    <button type={type} className={className} onClick={exportToExcel}>
      Download XLSX
    </button>
  )
}

export default DownloadXLSX

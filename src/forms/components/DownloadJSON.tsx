import React from "react"

interface DownloadJSONProps {
  data: any
  fileName: string
  type?: "button" | "submit" | "reset" // Match the allowed types
  className?: string
}

const DownloadJSON = ({ data, fileName, type = "button", className }: DownloadJSONProps) => {
  const downloadJSON = () => {
    const jsonData = new Blob([JSON.stringify(data)], { type: "application/json" })
    const jsonURL = URL.createObjectURL(jsonData)
    const link = document.createElement("a")
    link.href = jsonURL
    link.download = `${fileName}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button type={type} className={className} onClick={downloadJSON}>
      Download JSON
    </button>
  )
}

export default DownloadJSON

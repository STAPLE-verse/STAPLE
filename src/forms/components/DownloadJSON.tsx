import React from "react"

const DownloadJSON = ({ data, fileName, className }) => {
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
    <button className={className} onClick={downloadJSON}>
      Download JSON
    </button>
  )
}

export default DownloadJSON

import React from "react"
import JSZip from "jszip"
import { saveAs } from "file-saver"

const DownloadZIP = ({ data, fileName, className }) => {
  const downloadZip = () => {
    const zip = new JSZip()
    data.forEach((formData) => {
      console.log(formData)
      const outputFile = `${formData.givenName.toLowerCase()}_${formData.familyName.toLowerCase()}_${
        formData.userId
      }.json`
      zip.file(outputFile, JSON.stringify(formData))
    })

    zip
      .generateAsync({ type: "blob" })
      .then((blob) => {
        saveAs(blob, fileName)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <button className={className} onClick={downloadZip}>
      Download ZIP
    </button>
  )
}

export default DownloadZIP

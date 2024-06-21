import JSZip from "jszip"
import { saveAs } from "file-saver"

export const testData = `
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "title": "Funding for Contributor or Project",
  "description": "Information about the funding for a Contributor or Project",
  "properties": {
    "funder": {
      "title": "Name of Funder:",
      "type": "string"
    },
    "description": {
      "title": "Description of the funding: ",
      "type": "string"
    },
    "identifier": {
      "title": "Funding number or other identifier:",
      "type": "string"
    }
  },
  "dependencies": {},
  "required": [
    "funder",
    "description",
    "identifier"
  ]
}
`

export function jsonFileDownload(fileName, data) {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`

  const link = document.createElement("a")
  link.href = jsonString
  link.download = `${fileName}.json`
  link.click()
}

export function zipJsonsDownload(fileName, data) {
  const zip = new JSZip()
  //get an actual data array of jsons
  zip.file("json1.json", data)
  zip.file("json2.json", data)

  zip.generateAsync({ type: "blob" }).then((blob) => {
    saveAs(blob, fileName)
  })
}

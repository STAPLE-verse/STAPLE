import { Notification } from "db"
import { createColumnHelper } from "@tanstack/react-table"
import { TemplateType, compileTemplate } from "../compileTemplate"
import { useEffect, useState } from "react"

// Column helper
const columnHelper = createColumnHelper<Notification>()

// Rename this shit
const TemplateCell = ({ templateId, data, type }) => {
  const [templateContent, setTemplateContent] = useState("Loading...")

  useEffect(() => {
    compileTemplate(templateId, data, type)
      .then((content) => {
        setTemplateContent(content) // This sets the HTML content we got from the template
      })
      .catch((error) => {
        console.error("Error compiling template:", error)
        setTemplateContent("Error loading content")
      })
  }, [templateId, data, type])

  // Use dangerouslySetInnerHTML to render the HTML content
  return <div dangerouslySetInnerHTML={{ __html: templateContent }} />
}

// ColumnDefs
export const notificationTableColumns = [
  columnHelper.accessor("createdAt", {
    cell: (info) => <span>{info.getValue().toString()}</span>,
    header: "Date",
  }),
  columnHelper.accessor("read", {
    cell: (info) => <span>{info.getValue().toString()} </span>,
    header: "Read",
  }),
  columnHelper.accessor("template", {
    id: "message",
    header: "",
    cell: (info) => {
      return (
        <TemplateCell
          templateId={info.getValue()}
          data={info.row.original.data}
          type={info.row.original.type as TemplateType}
        />
      )
    },
  }),
]

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"

export default function MarkdownDescriptionInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [mode, setMode] = useState<"edit" | "preview">("edit")

  return (
    <div className="form-description-wrapper">
      <div className="form-desc-toolbar flex items-center gap-2 mb-1">
        <div className="join">
          <button
            type="button"
            className={`btn btn-sm join-item ${mode === "edit" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMode("edit")}
          >
            Edit
          </button>
          <button
            type="button"
            className={`btn btn-sm join-item ${mode === "preview" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMode("preview")}
          >
            Preview
          </button>
        </div>
        <span className="text-sm opacity-60 italic">Supports Markdown</span>
      </div>
      {mode === "edit" ? (
        <textarea
          value={value}
          placeholder="Description"
          rows={4}
          className="form-description w-full"
          onChange={(ev) => onChange(ev.target.value)}
        />
      ) : (
        <div className="markdown-display prose max-w-none dark:prose-invert p-2 bg-base-200 rounded border border-base-300 min-h-[6rem]">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {value || "_Nothing to preview yet…_"}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}

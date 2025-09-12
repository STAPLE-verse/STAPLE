"use client" // harmless in Blitz; ensures CSR if you move this to app router later
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  EditorState,
  KEY_ENTER_COMMAND,
  COMMAND_PRIORITY_LOW,
  TextFormatType,
} from "lexical"
import {
  TRANSFORMERS,
  $convertToMarkdownString,
  $convertFromMarkdownString,
} from "@lexical/markdown"
import debounce from "lodash.debounce"
import { useMutation } from "@blitzjs/rpc"
import createNote from "src/notes/mutations/createNote"
import updateNote from "src/notes/mutations/updateNote"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { ListNode, ListItemNode } from "@lexical/list"
import { UNDO_COMMAND, REDO_COMMAND } from "lexical"

import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { CodeNode } from "@lexical/code"
import { LinkNode } from "@lexical/link"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"

const normalizeVisibility = (
  v: "PRIVATE" | "PM_ONLY" | "CONTRIBUTORS" | "SHARED" | undefined
): "PRIVATE" | "PM_ONLY" | "CONTRIBUTORS" => {
  if (v === "SHARED") return "CONTRIBUTORS"
  if (v === "PRIVATE" || v === "PM_ONLY" || v === "CONTRIBUTORS") return v
  return "PRIVATE"
}

function ResetFormatOnEnterPlugin() {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent | null) => {
        // Don’t interfere with soft line breaks (Shift+Enter)
        if (event && event.shiftKey) return false
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const formats: TextFormatType[] = ["bold", "italic", "underline", "strikethrough", "code"]
          for (const fmt of formats) {
            if (selection.hasFormat(fmt)) {
              // toggle off any active format so the new paragraph starts plain
              selection.formatText(fmt)
            }
          }
        }
        return false // allow default Enter behavior to continue
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor])
  return null
}

type Props = {
  projectId: number
  noteId?: number
  initialMarkdown?: string
  initialJSON?: any
  initialTitle?: string
  className?: string
  onCreated?: (id: number) => void
  onSaved?: (id: number) => void
  readOnly?: boolean
  onClose?: () => void
  initialVisibility?: "PRIVATE" | "PM_ONLY" | "CONTRIBUTORS"
  canSetContributors?: boolean
}

function Toolbar({
  title,
  onTitleChange,
  onSaveAndClose,
  isSaving,
  lastSavedAt,
  readOnly,
  onClose,
  visibility,
  onVisibilityChange,
  canSetContributors,
  mode,
  onChangeMode,
}: {
  title: string
  onTitleChange: (v: string) => void
  onSaveAndClose: (state: EditorState) => void
  isSaving: boolean
  lastSavedAt: number | null
  readOnly: boolean
  onClose?: () => void
  visibility: "PRIVATE" | "PM_ONLY" | "CONTRIBUTORS"
  onVisibilityChange: (v: "PRIVATE" | "PM_ONLY" | "CONTRIBUTORS") => void
  canSetContributors?: boolean
  mode: "edit" | "preview"
  onChangeMode: (m: "edit" | "preview") => void
}) {
  const [editor] = useLexicalComposerContext()

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-base-300 bg-base-300">
      <input
        type="text"
        className="input w-64 bg-base-100"
        placeholder="Untitled"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={(e) => {
          if (readOnly) return
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
            e.preventDefault()
            onSaveAndClose(editor.getEditorState())
          }
        }}
        disabled={readOnly}
        readOnly={readOnly}
      />
      <div className="divider divider-horizontal m-0" />
      <select
        className="select select-bordered w-50 border-primary border-2"
        value={visibility}
        onChange={(e) => onVisibilityChange(e.target.value as any)}
        disabled={readOnly}
      >
        <option value="PRIVATE">Private</option>
        <option value="PM_ONLY">Project Managers</option>
        <option value="CONTRIBUTORS" disabled={canSetContributors === false}>
          Contributors
        </option>
      </select>
      <div className="divider divider-horizontal m-0" />
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        disabled={readOnly}
      >
        Undo
      </button>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        disabled={readOnly}
      >
        Redo
      </button>
      <div className="divider divider-horizontal m-0" />
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`btn btn-outline ${mode === "edit" ? "border-2 border-primary" : ""}`}
          onClick={() => onChangeMode("edit")}
          disabled={readOnly}
        >
          Edit
        </button>
        <button
          type="button"
          className={`btn btn-outline ${mode === "preview" ? "border-2 border-primary" : ""}`}
          onClick={() => onChangeMode("preview")}
        >
          Preview
        </button>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {!readOnly && (
          <span className="opacity-70">
            {isSaving
              ? "Saving…"
              : lastSavedAt
              ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()}`
              : ""}
          </span>
        )}
        {readOnly ? (
          <button type="button" className="btn" onClick={() => onClose?.()}>
            Close
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onSaveAndClose(editor.getEditorState())}
          >
            Save & Close
          </button>
        )}
      </div>
    </div>
  )
}

export default function NoteEditor({
  projectId,
  noteId,
  initialMarkdown = "",
  initialJSON = null,
  initialTitle = "",
  className,
  onCreated,
  onSaved,
  readOnly = false,
  onClose,
  initialVisibility = "PRIVATE",
  canSetContributors,
}: Props) {
  const [createNoteMutation] = useMutation(createNote)
  const [updateNoteMutation] = useMutation(updateNote)
  const [currentNoteId, setCurrentNoteId] = useState<number | undefined>(noteId)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)
  const [title, setTitle] = useState<string>(initialTitle || "")
  const [visibility, setVisibility] = useState<"PRIVATE" | "PM_ONLY" | "CONTRIBUTORS">(
    normalizeVisibility(initialVisibility as any)
  )
  const didInitialChange = useRef(false)

  const [mode, setMode] = useState<"edit" | "preview">(readOnly ? "preview" : "edit")
  const [previewMarkdown, setPreviewMarkdown] = useState<string>(initialMarkdown || "")

  useEffect(() => {
    setVisibility(normalizeVisibility(initialVisibility as any))
  }, [initialVisibility])

  useEffect(() => {
    if (initialMarkdown) {
      setPreviewMarkdown(initialMarkdown)
    }
  }, [initialMarkdown])

  const effectiveReadOnly = useMemo(() => {
    if (visibility === "CONTRIBUTORS" && canSetContributors) return false
    return readOnly
  }, [readOnly, visibility, canSetContributors])

  const initialConfig = useMemo(
    () => ({
      namespace: "staple-notes",
      nodes: [ListNode, ListItemNode, HeadingNode, QuoteNode, CodeNode, LinkNode],
      onError: (e: any) => console.error(e),
      editable: !effectiveReadOnly,
      editorState: (editor: any) => {
        if (initialJSON) {
          editor.setEditorState(editor.parseEditorState(initialJSON))
        } else if (initialMarkdown) {
          editor.update(() => {
            const root = $getRoot()
            root.clear()
            $convertFromMarkdownString(initialMarkdown, TRANSFORMERS)
          })
        }
      },
    }),
    [initialJSON, initialMarkdown, effectiveReadOnly]
  )

  const save = useCallback(
    async (editorState: EditorState, closeAfter: boolean = false) => {
      let contentMarkdown = ""
      let contentJSON: any
      let savedId: number | undefined

      editorState.read(() => {
        contentMarkdown = $convertToMarkdownString(TRANSFORMERS)
      })
      setPreviewMarkdown(contentMarkdown)
      contentJSON = editorState.toJSON()

      const visibilityForMutation = visibility as any

      if (!currentNoteId) {
        const created = await createNoteMutation({
          projectId,
          title: title?.trim() || "Untitled",
          contentMarkdown,
          contentJSON,
          visibility: visibilityForMutation,
        })
        setCurrentNoteId(created.id)
        onCreated?.(created.id)
        savedId = created.id
      } else {
        await updateNoteMutation({
          id: currentNoteId,
          title: title?.trim() || "Untitled",
          contentMarkdown,
          contentJSON,
          visibility: visibilityForMutation,
        })
        savedId = currentNoteId
      }
      setIsSaving(false)
      setLastSavedAt(Date.now())
      if (closeAfter && savedId) onSaved?.(savedId)
    },
    [
      currentNoteId,
      projectId,
      createNoteMutation,
      updateNoteMutation,
      onCreated,
      onSaved,
      title,
      visibility,
    ]
  )

  const debouncedSave = useMemo(
    () => debounce((state: EditorState) => save(state, false), 800),
    [save]
  )

  return (
    <div className={`rounded-md border border-base-100 bg-base-300 ${className ?? ""}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar
          title={title}
          onTitleChange={setTitle}
          onSaveAndClose={(state) => save(state, true)}
          isSaving={isSaving}
          lastSavedAt={lastSavedAt}
          readOnly={effectiveReadOnly}
          onClose={onClose}
          visibility={visibility}
          onVisibilityChange={setVisibility}
          canSetContributors={canSetContributors}
          mode={mode}
          onChangeMode={setMode}
        />
        <div className="p-3">
          {mode === "edit" ? (
            <>
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="min-h-[180px] outline-none prose max-w-none dark:prose-invert text-lg" />
                }
                placeholder={<div className="opacity-50">Write a note…</div>}
                ErrorBoundary={LexicalErrorBoundary as any}
              />
              <HistoryPlugin />
              <ListPlugin />
              <ResetFormatOnEnterPlugin />
              <OnChangePlugin
                onChange={(state) => {
                  if (effectiveReadOnly) return
                  if (!didInitialChange.current) {
                    didInitialChange.current = true
                    return
                  }
                  // Update live preview markdown and save debounced
                  state.read(() => {
                    const md = $convertToMarkdownString(TRANSFORMERS)
                    setPreviewMarkdown(md)
                  })
                  setIsSaving(true)
                  debouncedSave(state)
                }}
              />
            </>
          ) : (
            <div className="markdown-display prose max-w-none dark:prose-invert text-lg p-3 bg-base-200 rounded-md border border-base-300">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    />
                  ),
                }}
              >
                {previewMarkdown || "_Nothing to preview yet…_"}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </LexicalComposer>
    </div>
  )
}

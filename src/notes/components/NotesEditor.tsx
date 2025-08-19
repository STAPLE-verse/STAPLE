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
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
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
    initialVisibility
  )
  const didInitialChange = useRef(false)

  const initialConfig = useMemo(
    () => ({
      namespace: "staple-notes",
      nodes: [ListNode, ListItemNode, HeadingNode, QuoteNode, CodeNode, LinkNode],
      onError: (e: any) => console.error(e),
      editable: !readOnly,
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
    [initialJSON, initialMarkdown, readOnly]
  )

  const save = useCallback(
    async (editorState: EditorState, closeAfter: boolean = false) => {
      let contentMarkdown = ""
      let contentJSON: any
      let savedId: number | undefined

      editorState.read(() => {
        contentMarkdown = $convertToMarkdownString(TRANSFORMERS)
      })
      contentJSON = editorState.toJSON()

      const visibilityForMutation = (visibility === "CONTRIBUTORS" ? "SHARED" : visibility) as any

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
          readOnly={readOnly}
          onClose={onClose}
          visibility={visibility}
          onVisibilityChange={setVisibility}
          canSetContributors={canSetContributors}
        />
        <div className="p-3">
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
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin
            onChange={(state) => {
              if (readOnly) return
              if (!didInitialChange.current) {
                didInitialChange.current = true
                return
              }
              setIsSaving(true)
              debouncedSave(state)
            }}
          />
        </div>
      </LexicalComposer>
    </div>
  )
}

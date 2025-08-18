"use client" // harmless in Blitz; ensures CSR if you move this to app router later
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { $getRoot, EditorState } from "lexical"
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
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list"
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from "lexical"

type Props = {
  projectId: number
  noteId?: number
  initialMarkdown?: string
  initialJSON?: any
  className?: string
  onCreated?: (id: number) => void
}

const theme = {
  paragraph: "mb-2",
  text: { bold: "font-semibold", italic: "italic", underline: "underline" },
}

function Toolbar() {
  const [editor] = useLexicalComposerContext()

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-base-300 bg-base-100">
      <button
        type="button"
        className="btn btn-xs"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        Bold
      </button>
      <button
        type="button"
        className="btn btn-xs"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        Italic
      </button>
      <button
        type="button"
        className="btn btn-xs"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        Underline
      </button>
      <div className="divider divider-horizontal m-0" />
      <button
        type="button"
        className="btn btn-xs"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      >
        Bulleted
      </button>
      <button
        type="button"
        className="btn btn-xs"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      >
        Numbered
      </button>
      <button
        type="button"
        className="btn btn-xs"
        onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}
      >
        Clear List
      </button>
      <div className="divider divider-horizontal m-0" />
      <button
        type="button"
        className="btn btn-xs"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        Undo
      </button>
      <button
        type="button"
        className="btn btn-xs"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        Redo
      </button>
    </div>
  )
}

export default function NoteEditor({
  projectId,
  noteId,
  initialMarkdown = "",
  initialJSON = null,
  className,
  onCreated,
}: Props) {
  const [createNoteMutation] = useMutation(createNote)
  const [updateNoteMutation] = useMutation(updateNote)
  const [currentNoteId, setCurrentNoteId] = useState<number | undefined>(noteId)

  const initialConfig = useMemo(
    () => ({
      namespace: "staple-notes",
      theme,
      onError: (e: any) => console.error(e),
      editable: true,
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
    [initialJSON, initialMarkdown]
  )

  const save = useCallback(
    async (editorState: EditorState) => {
      let contentMarkdown = ""
      let contentJSON: any

      editorState.read(() => {
        contentMarkdown = $convertToMarkdownString(TRANSFORMERS)
      })
      contentJSON = editorState.toJSON()

      if (!currentNoteId) {
        const created = await createNoteMutation({
          projectId,
          contentMarkdown,
          contentJSON,
        })
        setCurrentNoteId(created.id)
        onCreated?.(created.id)
      } else {
        await updateNoteMutation({ id: currentNoteId, contentMarkdown, contentJSON })
      }
    },
    [currentNoteId, projectId, createNoteMutation, updateNoteMutation, onCreated]
  )

  const debouncedSave = useMemo(() => debounce(save, 800), [save])

  return (
    <div className={`rounded-md border border-base-300 bg-base-100 ${className ?? ""}`}>
      <Toolbar />
      <LexicalComposer initialConfig={initialConfig}>
        <div className="p-3">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[180px] outline-none prose max-w-none dark:prose-invert" />
            }
            placeholder={<div className="opacity-50">Write a note…</div>}
            ErrorBoundary={LexicalErrorBoundary as any}
          />
          <HistoryPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={(state) => debouncedSave(state)} />
        </div>
      </LexicalComposer>
    </div>
  )
}

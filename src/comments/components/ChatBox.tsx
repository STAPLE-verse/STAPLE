import { useEffect, useRef, useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import addComment from "../mutations/addComment"
import markAsRead from "../mutations/markAsRead"
import { CommentWithAuthor } from "src/core/types"
import { getContributorName } from "src/core/utils/getName"
import { useParam } from "@blitzjs/next"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"

interface ChatBoxProps {
  initialComments?: CommentWithAuthor[]
  taskLogId: number
  refetchComments?: () => void
}

export default function ChatBox({
  initialComments = [], // Ensure default value as empty array
  taskLogId,
  refetchComments,
}: ChatBoxProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [mode, setMode] = useState<"edit" | "preview">("edit")
  const chatRef = useRef<HTMLDivElement>(null)
  const [addCommentMutation] = useMutation(addComment)
  const [markCommentsAsReadMutation] = useMutation(markAsRead)

  const projectId = useParam("projectId", "number")
  const { projectMember: currentContributor } = useCurrentContributor(projectId)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [comments])

  useEffect(() => {
    if (currentContributor && comments.length > 0) {
      const unreadCommentIds = comments
        .filter(
          (comment) =>
            comment.authorId !== currentContributor.id &&
            !comment.commentReadStatus?.some(
              (status) => status.projectMemberId === currentContributor.id && status.read
            )
        )
        .map((comment) => comment.id)

      if (unreadCommentIds.length > 0) {
        markCommentsAsReadMutation({
          commentIds: unreadCommentIds,
          projectMemberId: currentContributor.id,
        })
          .then(() => {
            if (refetchComments) void refetchComments()
          })
          .catch((error) => {
            console.error("Failed to mark comments as read:", error)
          })
      }
    }
  }, [comments, currentContributor, markCommentsAsReadMutation, refetchComments])

  const handleSendComment = async () => {
    if (!newComment.trim()) return // Prevent empty messages

    try {
      const createdComment = await addCommentMutation({
        taskLogId: taskLogId,
        projectMemberId: currentContributor!.id,
        content: newComment,
      })
      setComments((prev) => [...prev, { ...createdComment, commentReadStatus: [] }]) // Ensure new comment has empty commentReadStatus
      setNewComment("") // Clear input field
      if (refetchComments) await refetchComments() // Trigger refresh
    } catch (error) {
      console.error("Failed to send comment:", error)
    }
  }

  return (
    <div className="flex flex-col h-[36rem] w-full rounded-lg">
      <div ref={chatRef} className="flex-1 overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((comment) => {
            const isCurrentContributor = comment.authorId === currentContributor!.id
            return (
              <div
                key={comment.id}
                className={`chat ${
                  comment.authorId === currentContributor!.id ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-header">
                  {getContributorName(comment.author) || "Unknown"}
                  <time className="text-s opacity-50 ml-2">
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString([], {
                          weekday: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </time>
                </div>
                <div
                  className={`chat-bubble ${
                    isCurrentContributor
                      ? "bg-accent text-accent-content"
                      : "bg-secondary text-secondary-content"
                  }`}
                >
                  <div className="break-words">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          />
                        ),
                        ul: ({ node, ...props }) => <ul {...props} className="list-disc ml-5" />,
                        ol: ({ node, ...props }) => <ol {...props} className="list-decimal ml-5" />,
                        p: ({ node, ...props }) => <p {...props} className="m-0 leading-snug" />,
                        code: ({ inline, className, children, ...props }) =>
                          inline ? (
                            <code className="px-1 rounded bg-base-200" {...props}>
                              {children}
                            </code>
                          ) : (
                            <pre className="p-2 rounded bg-base-200 overflow-auto">
                              <code {...props}>{children}</code>
                            </pre>
                          ),
                      }}
                    >
                      {comment.content || "[No Content]"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-center text-base italic">No comments yet...</p>
        )}
      </div>

      {/* Input Field (Markdown with Preview) */}
      <div className="mt-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between mt-2 mb-2">
          <div className="flex items-center">
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
                className={`btn btn-sm join-item ${
                  mode === "preview" ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setMode("preview")}
              >
                Preview
              </button>
            </div>
            <span className="text-base-content ml-3 italic">
              Supports{" "}
              <a
                href="https://www.markdownguide.org/cheat-sheet/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Markdown
              </a>{" "}
              formatting.
            </span>
          </div>
          <span className="text-sm opacity-70 ml-4 whitespace-nowrap">
            Enter to send • Shift+Enter for newline
          </span>
        </div>

        {mode === "edit" ? (
          <textarea
            className="textarea text-primary textarea-bordered textarea-primary w-full bg-base-300 border-2 focus:border-secondary focus:ring-2 focus:ring-secondary text-lg h-32 resize-none overflow-y-auto"
            placeholder="Type a message..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                void handleSendComment()
              }
            }}
          />
        ) : (
          <div
            className="textarea textarea-bordered textarea-primary w-full bg-base-300 border-2 text-primary text-lg h-32 overflow-y-auto mb-4"
            data-testid="labeledpreview-testid"
          >
            <div className="break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary"
                    />
                  ),
                  p: ({ node, ...props }) => <p {...props} className="m-0 leading-snug" />,
                }}
              >
                {newComment || "_Nothing to preview yet…_"}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end mt-2">
          <button className="btn btn-primary" onClick={handleSendComment}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

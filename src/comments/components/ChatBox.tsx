import { useEffect, useRef, useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import addComment from "../mutations/addComment"
import { CommentWithAuthor } from "src/core/types"
import { getContributorName } from "src/core/utils/getName"
import { useParam } from "@blitzjs/next"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"

interface ChatBoxProps {
  initialComments?: CommentWithAuthor[]
  taskLogId: number
}

export default function ChatBox({
  initialComments = [], // Ensure default value as empty array
  taskLogId,
}: ChatBoxProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const chatRef = useRef<HTMLDivElement>(null)
  const [addCommentMutation] = useMutation(addComment)

  const projectId = useParam("projectId", "number")
  const { projectMember: currentContributor } = useCurrentContributor(projectId)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [comments])

  const handleSendComment = async () => {
    if (!newComment.trim()) return // Prevent empty messages

    try {
      const createdComment = await addCommentMutation({
        taskLogId: taskLogId,
        projectMemberId: currentContributor!.id,
        content: newComment,
      })
      setComments((prev) => [...prev, createdComment]) // Update state directly
      setNewComment("") // Clear input field
    } catch (error) {
      console.error("Failed to send comment:", error)
    }
  }

  return (
    <div className="flex flex-col max-h-96 w-full rounded-lg">
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
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString() : "N/A"}
                  </time>
                </div>
                <div
                  className={`chat-bubble ${
                    isCurrentContributor
                      ? "bg-accent text-accent-content"
                      : "bg-secondary text-secondary-content"
                  }`}
                >
                  {comment.content || "[No Content]"}
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-center text-base italic">No comments yet...</p>
        )}
      </div>

      {/* Input Field */}
      <div className="flex items-center mt-4 gap-2">
        <input
          type="text"
          className="input w-full text-primary input-primary input-bordered border-2 bg-base-300 flex-1 mr-2"
          placeholder="Type a message..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendComment()} // Send on Enter key press
        />
        <button className="btn btn-primary" onClick={handleSendComment}>
          Send
        </button>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from "react"
import { Comment } from "db"
import { useMutation } from "@blitzjs/rpc"
import addComment from "../mutations/addComment"

interface ChatBoxProps {
  initialComments?: Comment[]
  taskLogId: number
  currentContributorId: number
}

export default function ChatBox({
  initialComments = [], // Ensure default value as empty array
  taskLogId,
  currentContributorId,
}: ChatBoxProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const chatRef = useRef<HTMLDivElement>(null)
  const [addCommentMutation] = useMutation(addComment)

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
        projectMemberId: currentContributorId,
        content: newComment,
      })
      setComments((prev) => [...prev, createdComment]) // Update state directly
      setNewComment("") // Clear input field
    } catch (error) {
      console.error("Failed to send comment:", error)
    }
  }

  return (
    <div className="flex flex-col h-96 bg-base-200 rounded-lg p-4">
      <div ref={chatRef} className="flex-1 overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`chat ${
                comment.authorId === currentContributorId ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-header">
                {comment.authorId || "Unknown"}
                <time className="text-xs opacity-50 ml-2">
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString() : "N/A"}
                </time>
              </div>
              <div className="chat-bubble">{comment.content || "[No Content]"}</div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 italic">No comments yet...</p>
        )}
      </div>

      {/* Input Field */}
      <div className="flex items-center mt-4 gap-2">
        <input
          type="text"
          className="input input-bordered flex-1"
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

import { useState, useRef } from "react"
import { useMutation } from "@blitzjs/rpc"
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import sendFeedback from "src/core/mutations/sendFeedback"
import toast from "react-hot-toast"

export const FeedbackButton = () => {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sendFeedbackMutation, { isLoading }] = useMutation(sendFeedback)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const openModal = () => dialogRef.current?.showModal()
  const closeModal = () => dialogRef.current?.close()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await sendFeedbackMutation({ subject, message })
      toast.success("Feedback sent! We'll be in touch.")
      setSubject("")
      setMessage("")
      closeModal()
    } catch {
      toast.error("Failed to send feedback. Please try again.")
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 z-50 btn btn-circle btn-primary shadow-lg"
        title="Send feedback"
      >
        <QuestionMarkCircleIcon className="w-6 h-6" />
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Send Feedback</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Subject</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Brief description of your feedback"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                maxLength={200}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Message</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-32"
                placeholder="Describe your issue or suggestion..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={5000}
              />
            </div>
            <div className="modal-action mt-2">
              <button type="button" className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? <span className="loading loading-spinner loading-sm" /> : "Send"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

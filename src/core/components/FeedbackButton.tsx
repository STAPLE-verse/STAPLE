import { useRef } from "react"
import { useMutation } from "@blitzjs/rpc"
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import { z } from "zod"
import sendFeedback from "src/core/mutations/sendFeedback"
import toast from "react-hot-toast"
import { Form } from "src/core/components/fields/Form"
import { LabeledTextField } from "src/core/components/fields/LabeledTextField"
import LabeledTextAreaField from "src/core/components/fields/LabeledTextAreaField"

const FeedbackSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
})

export const FeedbackButton = () => {
  const [sendFeedbackMutation] = useMutation(sendFeedback)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const openModal = () => dialogRef.current?.showModal()
  const closeModal = () => dialogRef.current?.close()

  const handleSubmit = async (values: { subject: string; message: string }) => {
    try {
      await sendFeedbackMutation(values)
      toast.success("Feedback sent! We'll be in touch.")
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

      <dialog
        ref={dialogRef}
        className="modal"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeModal()
        }}
      >
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <h3 className="font-bold text-lg mb-4">Send Feedback</h3>
          <Form
            schema={FeedbackSchema}
            onSubmit={handleSubmit}
            submitText="Send"
            cancelText="Cancel"
            onCancel={closeModal}
            summitOnRight
          >
            <LabeledTextField
              name="subject"
              label="Subject"
              placeholder="Brief description of your feedback"
              className="input mb-4 w-full text-primary input-primary input-bordered border-2 bg-base-300"
            />
            <LabeledTextAreaField
              name="message"
              label="Message"
              placeholder="Describe your issue or suggestion..."
              className="textarea textarea-primary textarea-bordered border-2 bg-base-300 text-primary mb-4 w-full"
              rows={6}
            />
          </Form>
        </div>
      </dialog>
    </>
  )
}

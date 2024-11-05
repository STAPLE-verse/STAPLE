import { createNewInvitation } from "integrations/emails"

export async function sendInvitationEmail(values: any, currentUser: any, projectMember: any) {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createNewInvitation(values, currentUser, projectMember)),
    })
    return response.ok
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

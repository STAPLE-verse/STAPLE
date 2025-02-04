export async function sendInvitationEmail(emailData) {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    return response.ok
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

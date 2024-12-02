import moment from "moment"
import getNotifications from "../src/notifications/queries/getNotifications"
import { createDailyNotification } from "integrations/emails"

export async function fetchAndGroupNotifications() {
  const last24Hours = moment().subtract(24, "hours").toDate()

  const { notifications } = await getNotifications({
    where: {
      createdAt: {
        gte: last24Hours,
      },
    },
    include: {
      recipients: { select: { email: true } },
      project: { select: { name: true } },
    },
  })

  return notifications.reduce((acc, notification) => {
    notification.recipients.forEach(({ email }) => {
      if (!acc[email]) acc[email] = {}
      const projectName = notification.project?.name || "No Project"
      if (!acc[email][projectName]) acc[email][projectName] = []
      acc[email][projectName].push(notification.message)
    })
    return acc
  }, {})
}

export async function sendGroupedNotifications(groupedNotifications) {
  for (const [email, projects] of Object.entries(groupedNotifications)) {
    const notificationContent = Object.entries(projects)
      .map(([projectName, messages]) => {
        const projectHeader = `<h4>Project: ${projectName}</h4>`
        const messagesList = messages.map((message) => `<li>${message}</li>`).join("")
        return projectHeader + `<ul>${messagesList}</ul>`
      })
      .join("")

    const emailContent = createDailyNotification(email, notificationContent)

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailContent),
      })

      if (!response.ok) {
        console.error(`Failed to send email to ${email}:`, response.statusText)
      } else {
        console.log(`Email sent successfully to ${email}`)
      }
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error)
    }
  }
}

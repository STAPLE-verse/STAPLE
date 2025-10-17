import dotenv from "dotenv"
dotenv.config({ path: "../.env.local" })
import moment from "moment"
import { PrismaClient } from "@prisma/client"
import fetch from "node-fetch"
import { resolver } from "@blitzjs/rpc"

const db = new PrismaClient() // Create Prisma client instance

// Helper function to create email content
function createDailyNotification(email, notificationContent) {
  const html_message = `
    <html>
      <body>
        <center>
          <img src="https://raw.githubusercontent.com/STAPLE-verse/STAPLE-verse.github.io/main/pics/staple_email.jpg"
            alt="STAPLE Logo" height="200">
        </center>

        <h3>STAPLE Daily Notifications</h3>

        <p>
          This email is to notify you about recent updates to your project(s). You can view all notifications on the <a href="https://app.staple.science/auth/login?next=%2Fnotifications">Notifications page</a> (you may be asked to log in).
          Here are new announcements, tasks, and other project updates:
        </p>

        ${notificationContent}
      </body>
    </html>
  `

  return {
    from: "STAPLE <app@staple.science>",
    to: email,
    subject: "STAPLE Daily Notifications",
    replyTo: "STAPLE Help <staple.helpdesk@gmail.com>",
    html: html_message,
  }
}

// Function to fetch notifications from the database
const getNotifications = resolver.pipe(
  async ({ where, include }) =>
    await db.notification.findMany({
      where, // Pass `where` directly here
      include,
      orderBy: { createdAt: "desc" }, // Sort by creation date if needed
    })
)

// Function to fetch and group notifications by email and project
export async function fetchAndGroupNotifications() {
  const last24Hours = moment().subtract(24, "hours").toDate()

  const notifications = await getNotifications({
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
    // Ensure recipients is defined as an array
    const recipients = notification.recipients || []

    recipients.forEach(({ email }) => {
      if (!acc[email]) acc[email] = {}
      const projectName = notification.project?.name || "No Project"
      if (!acc[email][projectName]) acc[email][projectName] = []
      acc[email][projectName].push(notification.message)
    })

    return acc
  }, {})
}

// Function to introduce a delay (in milliseconds)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const maxEmailsPerMinute = 100 // Max number of emails to send per minute
let emailCount = 0 // Keep track of the number of emails sent
let startTime = Date.now() // Track the time when email sending starts

// Function to check if the rate limit is exceeded
const checkRateLimit = async () => {
  // Check if we have sent maxEmailsPerMinute emails
  if (emailCount >= maxEmailsPerMinute) {
    const elapsedTime = Date.now() - startTime // Get time elapsed in milliseconds
    const timeLeft = 60000 - elapsedTime // Calculate remaining time for the current minute

    if (timeLeft > 0) {
      console.log(`Rate limit reached. Waiting for ${timeLeft / 1000}s...`)
      // Wait for the remaining time before sending the next batch of emails
      await delay(timeLeft)
    } else {
      // If a minute has passed, reset the counter and start time
      emailCount = 0
      startTime = Date.now()
    }
  }
}
// Function to send grouped notifications
export async function sendGroupedNotifications(groupedNotifications) {
  const delayTime = 500 // Delay time between each email in milliseconds (e.g., 1 second)

  for (const [email, projects] of Object.entries(groupedNotifications)) {
    const notificationContent = Object.entries(projects)
      .map(([projectName, messages]) => {
        const projectHeader = `<h4>Project: ${projectName}</h4>`
        const messagesList = messages.map((message) => `<li>${message}</li>`).join("")
        return projectHeader + `<ul>${messagesList}</ul>`
      })
      .join("")

    const emailContent = createDailyNotification(email, notificationContent)

    // Check rate limit before sending email
    await checkRateLimit()

    // Send email
    try {
      const response = await fetch("https://app.staple.science/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailContent),
      })

      if (!response.ok) {
        console.error(`Failed to send email to ${email}:`, response.statusText)
      } else {
        console.log(`Email sent successfully to ${email}`)
      }

      emailCount++ // Increment the email count after sending each email

      // Add delay between emails to avoid too many requests in a short time
      await delay(delayTime)
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error)
    }
  }
}

// Function to fetch and send daily notifications
async function sendDailyNotifications() {
  try {
    const groupedNotifications = await fetchAndGroupNotifications()
    await sendGroupedNotifications(groupedNotifications)
  } catch (error) {
    console.error("Error in sendDailyNotifications:", error)
  }
}

// Run the daily notifications job
sendDailyNotifications()
  .then(() => {
    console.log(`[${new Date().toISOString()}] Daily notifications job completed successfully.`)
  })
  .catch((error) => {
    console.error(`[${new Date().toISOString()}] Error in daily notifications job:`, error)
  })
  .finally(async () => {
    await db.$disconnect() // Disconnect from the database when done
  })

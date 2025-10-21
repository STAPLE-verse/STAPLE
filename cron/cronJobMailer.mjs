import dotenv from "dotenv"
dotenv.config({ path: "../.env.local" })
import moment from "moment"
import { PrismaClient } from "@prisma/client"
import fetch from "node-fetch"
import { resolver } from "@blitzjs/rpc"

const db = new PrismaClient() // Create Prisma client instance

function fmtDate(date) {
  return moment(date).format("MMM D, YYYY")
}

// Helper function to create email content
function createDailyNotification(email, notificationContent, overdueContent) {
  const html_message = `
    <html>
      <body>
        <center>
          <img src="https://raw.githubusercontent.com/STAPLE-verse/STAPLE-verse.github.io/main/pics/staple_email.jpg"
            alt="STAPLE Logo" height="200">
        </center>

        <h3>STAPLE Daily Notifications</h3>

        <p>
          This email is to notify you about overdue tasks and recent updates to your project(s).
          You can view all notifications on the <a href="https://app.staple.science/auth/login?next=%2Fnotifications">Notifications page</a>.
          </p>

        <h3>⏰ Overdue Tasks</h3>
        <div style="margin:0 0 16px;">${overdueContent}</div>

        <h3>📢 Project Updates</h3>
        <div style="margin:0 0 16px;">${notificationContent}</div>
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

// Function to fetch and group overdue tasks by email and project
export async function fetchAndGroupOverdueTasks() {
  const now = new Date()

  const tasks = await db.task.findMany({
    where: {
      deadline: { lt: now },
    },
    include: {
      project: { select: { name: true } },
      assignedMembers: {
        include: {
          users: { select: { email: true } },
        },
      },
      taskLogs: {
        select: {
          id: true,
          createdAt: true,
          assignedToId: true,
          status: true,
          completedById: true,
          completedAs: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { deadline: "asc" },
  })

  // A task counts as overdue for a member only if that member has a latest log and it is NOT_COMPLETED.
  // If there is no log for that member, assume not assigned → do not include.
  const isUnfinishedLatest = (log) => {
    if (!log) return false
    const s = (log.status || "").toString().toUpperCase()
    return s === "NOT_COMPLETED"
  }

  // Group as: email -> projectName -> [task rows]
  return tasks.reduce((acc, task) => {
    const projectName = task?.project?.name || "No Project"
    const taskName = task?.name || `Task #${task?.id}`
    const due = task?.deadline ? fmtDate(task.deadline) : "no due date"
    const pastDeadline = task?.deadline && task.deadline < now

    // Map latest TaskLog by assignee (assignedToId) — schema note: TaskLog does not have projectmemberId
    const latestByMember = new Map()
    for (const log of task.taskLogs || []) {
      if (!latestByMember.has(log.assignedToId)) {
        latestByMember.set(log.assignedToId, log)
      }
    }

    const members = task?.assignedMembers || []
    if (members.length === 0) return acc

    for (const m of members) {
      const latest = latestByMember.get(m.id)
      const isUnfinished = isUnfinishedLatest(latest)

      if (pastDeadline && isUnfinished) {
        const line = `${projectName} - ${taskName} - Due: ${due}`
        const users = m?.users || []
        for (const u of users) {
          const email = u?.email
          if (!email) continue
          if (!acc[email]) acc[email] = {}
          if (!acc[email][projectName]) acc[email][projectName] = []
          acc[email][projectName].push(line)
        }

        // TODO: If assignment is to a team, add logic here to notify team distribution list or members
      }
    }

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
export async function sendGroupedNotifications(groupedNotifications, groupedOverdues) {
  const delayTime = 500 // Delay time between each email in milliseconds (e.g., 1 second)

  const allEmails = new Set([
    ...Object.keys(groupedNotifications || {}),
    ...Object.keys(groupedOverdues || {}),
  ])

  for (const email of allEmails) {
    const projects = groupedNotifications?.[email] || {}

    const notificationContent =
      Object.entries(projects)
        .map(([projectName, messages]) => {
          const projectHeader = `<h4>Project: ${projectName}</h4>`
          const messagesList = messages.map((message) => `<li>${message}</li>`).join("")
          return projectHeader + `<ul>${messagesList}</ul>`
        })
        .join("") || "<p>No new updates in the last 24 hours.</p>"

    // Build overdue content for this recipient (if any)
    const overdueProjects = groupedOverdues?.[email] || {}
    const overdueContent =
      Object.entries(overdueProjects)
        .map(([projectName, rows]) => {
          const projectHeader = `<h4>Project: ${projectName}</h4>`
          const items = rows.map((row) => `<li>${row}</li>`).join("")
          return projectHeader + `<ul>${items}</ul>`
        })
        .join("") || "<p>No overdue tasks 🎉</p>"

    const emailContent = createDailyNotification(email, notificationContent, overdueContent)

    console.log(
      `[Mailer] Prepared email for ${email}: hasOverdues=${!!Object.keys(overdueProjects)
        .length}, hasUpdates=${!!Object.keys(projects).length}`
    )

    // Check rate limit before sending email
    await checkRateLimit()

    // Send email
    try {
      const response = await fetch("https://app.staple.science/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailContent),
      })

      const respText = await response.text().catch(() => "<no body>")
      if (!response.ok) {
        console.error(
          `Failed to send email to ${email}: ${response.status} ${response.statusText} — ${respText}`
        )
      } else {
        console.log(
          `Email sent successfully to ${email}: ${response.status} — ${respText.substring(
            0,
            120
          )}...`
        )
      }

      emailCount++ // Increment the email count after sending each email

      // Add delay between emails to avoid too many requests in a short time
      await delay(delayTime)
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error)
    }
  }

  console.log(`[Mailer] Processed ${allEmails.size} recipients.`)
}

// Function to fetch and send daily notifications
async function sendDailyNotifications() {
  try {
    const [groupedNotifications, groupedOverdues] = await Promise.all([
      fetchAndGroupNotifications(),
      fetchAndGroupOverdueTasks(),
    ])
    await sendGroupedNotifications(groupedNotifications, groupedOverdues)
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

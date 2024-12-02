import cron from "node-cron"
import { fetchAndGroupNotifications, sendGroupedNotifications } from "notificationsHandler"

async function sendDailyNotifications() {
  try {
    const groupedNotifications = await fetchAndGroupNotifications()
    await sendGroupedNotifications(groupedNotifications)
  } catch (error) {
    console.error("Error in sendDailyNotifications:", error)
  }
}

cron.schedule("0 0 * * *", async () => {
  console.log(`[${new Date().toISOString()}] Running daily notifications job...`)
  try {
    await sendDailyNotifications()
    console.log(`[${new Date().toISOString()}] Daily notifications job completed successfully.`)
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in daily notifications job:`, error)
  }
})

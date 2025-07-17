import mitt from "mitt"

// Define all the events your app will use
type AppEvents = {
  taskLogUpdated: void
  announcementCreated: void
  milestoneTasksUpdated: void
  // Add more events here as needed:
  // modalClosed: void
  // userLoggedIn: { userId: number }
}

export const eventBus = mitt<AppEvents>()

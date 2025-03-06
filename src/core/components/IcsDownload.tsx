import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { createEvent } from "ics"
import getProjectMember from "src/projectmembers/queries/getProjectMember"

const downloadICSFile = (task, person) => {
  if (!task || !task.deadline || !task.name || !task.createdById) {
    console.error("Invalid task data provided")
    return
  }

  // Convert deadline to [year, month, day, hour, minute] format
  const deadlineDate = new Date(task.deadline)
  const eventStart: [number, number, number, number, number] = [
    deadlineDate.getFullYear(),
    deadlineDate.getMonth() + 1, // JS months are 0-based
    deadlineDate.getDate(),
    deadlineDate.getHours(),
    deadlineDate.getMinutes(),
  ]

  const event = {
    start: eventStart,
    title: task.name,
    description: task.description || "",
    duration: { hours: 1 },
    location: "STAPLE App",
    url: "https://app.staple.science",
    organizer: {
      name:
        person?.users?.[0]?.firstName && person?.users?.[0]?.lastName
          ? `${person.users[0].firstName} ${person.users[0].lastName}`
          : person?.users?.[0]?.username || "Unknown Organizer",
      email: person?.users?.[0]?.email || "no-email@staple.science",
    },
  }

  createEvent(event, (error, value) => {
    if (error) {
      console.error("Error creating .ics file", error)
      return
    }

    const blob = new Blob([value], { type: "text/calendar" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${task.name.replace(/\s+/g, "_")}.ics`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  })
}

const ICSDownloadButton = ({ task }) => {
  const projectId = useParam("projectId", "number") // ✅ Fetch `projectId` at the component level

  // ✅ Fetch project member info at the component level
  const [person] = useQuery(getProjectMember, {
    where: { id: task.createdById, project: { id: projectId! } },
    include: {
      users: true,
    },
  })

  return (
    <button className="btn btn-primary w-1/3" onClick={() => downloadICSFile(task, person)}>
      Add to Calendar
    </button>
  )
}

export default ICSDownloadButton

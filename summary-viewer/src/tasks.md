---
title: Tasks
toc: false
---

<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css">
<script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
<link rel="stylesheet" href="style.css">

```js libraries
const jsonData = FileAttachment("./data/project_summary.json").json()
import * as d3 from "npm:d3"
import Plotly from "npm:plotly.js-dist"
```

```js overall-functions
const getComputedThemeColors = () => {
  const root = getComputedStyle(document.documentElement)
  return {
    primary: root.getPropertyValue("--primary-color").trim(),
    primary2: root.getPropertyValue("--primary-color-2").trim(),
    primary3: root.getPropertyValue("--primary-color-3").trim(),
    primary4: root.getPropertyValue("--primary-color-4").trim(),
    secondary: root.getPropertyValue("--secondary-color").trim(),
  }
}

const themeColors = getComputedThemeColors()
```

```js get-people-roles-tasks
// Extract project members where there is exactly one user in the `users` array
const filteredMembers = jsonData.projectMembers.filter((member) => member.name === null)

// Map the data into a dataframe-like array of objects
const projectMembersDataFrame = filteredMembers.map((member) => {
  const user = member.users[0]
  const roles = member.roles.map((role) => role.name).join(", ")
  return {
    projectMemberId: member.id,
    username: user.username || "Not Provided",
    firstName: user.firstName || "Not Provided",
    lastName: user.lastName || "Not Provided",
    roles: roles || "No Roles",
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  }
})

// Extract project members where there is more than one user in the `users` array
const groupMembers = jsonData.projectMembers.filter((member) => member.name !== null)

// Map the data into a dataframe-like array of objects, each user gets their own row
const groupMembersDataFrame = groupMembers.flatMap((member) => {
  return member.users.map((user) => ({
    projectMemberId: member.id,
    groupName: member.name || "Unnamed Group",
    username: user.username || "Not Provided",
    firstName: user.firstName || "Not Provided",
    lastName: user.lastName || "Not Provided",
    roles: member.roles.map((role) => role.name).join(", ") || "No Roles",
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  }))
})

// Extract tasks data and expand to include task logs
const tasksDataFrame = jsonData.tasks.flatMap((task) =>
  task.taskLogs
    //.filter((log) => log.completedById !== null) // Skip logs where completedById is null
    .map((log) => ({
      taskId: task.id,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      createdById: task.createdById,
      formVersionId: task.formVersionId || "Not Provided",
      deadline: task.deadline || "No Deadline",
      name: task.name || "Unnamed Task",
      description: task.description || "No Description",
      status: task.status || "Unknown Status",
      milestoneName: task.milestone?.name || "No Milestone Name",
      milestoneDescription: task.milestone?.description || "No Milestone Description",
      taskLogCreatedAt: log.createdAt,
      taskLogStatus: log.status || "Unknown Status",
      taskLogMetadata: log.metadata || "No Metadata",
      completedById: log.completedById || "Task Created",
      assignedToId: log.assignedToId,
      roles: task.roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        taxonomy: role.taxonomy,
      })),
    }))
)
```

```js task-with-names
const tasksWithNames = tasksDataFrame.map((task) => {
  // Find the assigned team or individual name
  const assignedName = (() => {
    const assignedTeam = groupMembersDataFrame.find(
      (team) => team.projectMemberId === task.assignedToId
    )

    if (assignedTeam) {
      return assignedTeam.groupName || "Unnamed Team"
    }

    const assignedMember = projectMembersDataFrame.find(
      (member) => member.projectMemberId === task.assignedToId
    )

    if (assignedMember) {
      const fullName = `${assignedMember.firstName?.trim() || "Not Provided"} ${
        assignedMember.lastName?.trim() || "Not Provided"
      }`.trim()
      return fullName === "Not Provided Not Provided"
        ? `No Name Provided (${assignedMember.username || "No Username"})`
        : `${fullName} (${assignedMember.username || "No Username"})`
    }
    return "Unassigned" // Fallback if no match is found
  })()

  // Find the completed by team or individual name
  const completedByName = (() => {
    if (task.completedById === "Task Created") {
      return "Task Created" // Special case handling
    }

    const completedByTeam = groupMembersDataFrame.find(
      (team) => team.projectMemberId === task.completedById
    )

    if (completedByTeam) {
      return completedByTeam.groupName || "Unnamed Team"
    }

    const completedByMember = projectMembersDataFrame.find(
      (member) => member.projectMemberId === task.completedById
    )

    if (completedByMember) {
      const fullName = `${completedByMember.firstName?.trim() || "Not Provided"} ${
        completedByMember.lastName?.trim() || "Not Provided"
      }`.trim()
      return fullName === "Not Provided Not Provided"
        ? `No Name Provided (${completedByMember.username || "No Username"})`
        : `${fullName} (${completedByMember.username || "No Username"})`
    }
    return "Unknown" // Fallback if no match is found
  })()

  // Combine role names into a single string
  const combinedRoles = task.roles.map((role) => role.name).join(", ")

  // Format taskLogMetadata as a JSON string if it contains data
  const formattedMetadata =
    task.taskLogMetadata && typeof task.taskLogMetadata === "object"
      ? JSON.stringify(task.taskLogMetadata, null, 2) // Pretty-printed JSON
      : task.taskLogMetadata

  // Convert taskLogStatus to a user-friendly format
  const formattedStatus = task.taskLogStatus === "COMPLETED" ? "Completed" : "Not Completed"

  const formattedTaskStatus = task.taskStatus === "COMPLETED" ? "Completed" : "Not Completed"

  // Return a new object with updated values
  return {
    ...task, // Spread the existing task data
    assignedTo: assignedName, // Replace assignedToId with the formatted name
    completedBy: completedByName, // Handle "Task Created" case and unknowns
    roles: combinedRoles, // Combine roles into a single string
    taskLogMetadata: formattedMetadata, // Pretty-print JSON if applicable
    taskLogStatus: formattedStatus, // User-friendly status
    status: formattedTaskStatus,
  }
})
```

```js task-statistics
// Step 1: Deduplicate tasks by taskId, keeping the latest log for each task
const latestTasks = Array.from(
  tasksDataFrame
    .reduce((map, task) => {
      if (
        !map.has(task.taskId) ||
        new Date(task.taskLogCreatedAt) > new Date(map.get(task.taskId).taskLogCreatedAt)
      ) {
        map.set(task.taskId, task) // Keep the latest task log
      }
      return map
    }, new Map())
    .values()
)

// Step 2: Calculate total tasks and completed tasks
const totalTasks = latestTasks.length
const completedTasks = latestTasks.filter((task) => task.status === "COMPLETED").length
// Step 3: Calculate percentage
const completedPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0

const dataCompletedTasks = [
  {
    values: [completedTasks, totalTasks - completedTasks],
    labels: ["Completed", "Remaining"],
    type: "pie",
    hole: 0.8, // Creates the donut effect
    textinfo: "none", // Hide default labels
    hoverinfo: "label+percent",
    marker: {
      colors: [themeColors.primary, themeColors.secondary],
    },
  },
]

// Layout for the donut chart
const layout = {
  annotations: [
    {
      font: {
        size: 20,
        color: themeColors.primary,
        weight: "bold", // Make the font bold
        family: "Arial, sans-serif",
      },
      showarrow: false,
      text: `${completedPercentage}%`, // Show percentage in the center
      x: 0.5,
      y: 0.5,
    },
  ],
  showlegend: false, // Hide legend for simplicity
  height: 150, // Adjust height for the card
  width: 150, // Adjust width for the card
  margin: { t: 10, b: 10, l: 10, r: 10 }, // Tighten the chart's margins
  plot_bgcolor: "rgba(0, 0, 0, 0)", // Transparent plot background
  paper_bgcolor: "rgba(0, 0, 0, 0)", // Transparent chart area background
}

// Render the chart
Plotly.newPlot("completed-tasks-chart", dataCompletedTasks, layout)
```

```js tasklog-statistics
const latestTaskLogs = Array.from(
  tasksDataFrame
    .reduce((map, log) => {
      const key = `${log.taskId}-${log.assignedToId}`
      const existingLog = map.get(key)

      // Keep the log with the latest `createdAt`
      if (!existingLog || new Date(log.taskLogCreatedAt) > new Date(existingLog.taskLogCreatedAt)) {
        map.set(key, log)
      }

      return map
    }, new Map())
    .values()
)

// Count the total number of rows
const totalTaskLogs = latestTaskLogs.length

// Count the number of tasks with a status of "COMPLETED"
const completedTaskLogs = latestTaskLogs.filter((log) => log.taskLogStatus === "COMPLETED").length
const completedPercentageLogs = ((completedTaskLogs / totalTaskLogs) * 100).toFixed(1) // Calculate percentage

const dataCompletedTasks = [
  {
    values: [completedTaskLogs, totalTaskLogs - completedTaskLogs],
    labels: ["Completed", "Remaining"],
    type: "pie",
    hole: 0.8, // Creates the donut effect
    textinfo: "none", // Hide default labels
    hoverinfo: "label+percent",
    marker: {
      colors: [themeColors.primary2, themeColors.secondary],
    },
  },
]

// Layout for the donut chart
const layout = {
  annotations: [
    {
      font: {
        size: 20,
        color: themeColors.primary2,
        weight: "bold", // Make the font bold
        family: "Arial, sans-serif",
      },
      showarrow: false,
      text: `${completedPercentageLogs}%`, // Show percentage in the center
      x: 0.5,
      y: 0.5,
    },
  ],
  showlegend: false, // Hide legend for simplicity
  height: 150, // Adjust height for the card
  width: 150, // Adjust width for the card
  margin: { t: 10, b: 10, l: 10, r: 10 }, // Tighten the chart's margins
  plot_bgcolor: "rgba(0, 0, 0, 0)", // Transparent plot background
  paper_bgcolor: "rgba(0, 0, 0, 0)", // Transparent chart area background
}

// Render the chart
Plotly.newPlot("completed-tasklogs-chart", dataCompletedTasks, layout)
```

```js avg-time-complete
// Step 1: Group logs by taskId and assignedToId
const taskLogMap = tasksDataFrame.reduce((map, log) => {
  const key = `${log.taskId}-${log.assignedToId}`

  if (!map.has(key)) {
    map.set(key, { firstLog: log, latestLog: log })
  } else {
    const currentEntry = map.get(key)

    // Update first log if current log is earlier
    if (new Date(log.taskLogCreatedAt) < new Date(currentEntry.firstLog.taskLogCreatedAt)) {
      currentEntry.firstLog = log
    }

    // Update latest log if current log is later
    if (new Date(log.taskLogCreatedAt) > new Date(currentEntry.latestLog.taskLogCreatedAt)) {
      currentEntry.latestLog = log
    }
  }

  return map
}, new Map())

// Step 2: Calculate completion times for completed tasks
let totalCompletionTime = 0
let completedCount = 0

taskLogMap.forEach(({ firstLog, latestLog }) => {
  // Only consider tasks that are completed
  if (latestLog.taskLogStatus === "COMPLETED") {
    const startTime = new Date(firstLog.taskLogCreatedAt)
    const completionTime = new Date(latestLog.taskLogCreatedAt)

    // Calculate time difference in days
    const timeDiffInDays = (completionTime - startTime) / (1000 * 60 * 60 * 24)
    totalCompletionTime += timeDiffInDays
    completedCount++
  }
})

// Step 3: Calculate average completion time
const averageCompletionTime =
  completedCount > 0 ? (totalCompletionTime / completedCount).toFixed(2) : 0
```

```js task-log-download
function createTaskDropdownAndDataTable(containerId, dataTableContainerId) {
  // Step 1: Get unique task names
  const taskNames = [...new Set(tasksWithNames.map((task) => task.name))]

  // Step 2: Create a select dropdown for task names
  const dropdownContainer = document.getElementById(containerId)
  dropdownContainer.innerHTML = "<h3>Select a Task</h3>"

  const selectElement = document.createElement("select")
  selectElement.className = "task-select"
  selectElement.innerHTML = `<option value="">-- Select a Task --</option>`

  // Step 3: Populate the dropdown options
  taskNames.forEach((taskName) => {
    const option = document.createElement("option")
    option.value = taskName
    option.textContent = taskName
    selectElement.appendChild(option)
  })

  dropdownContainer.appendChild(selectElement)

  // Step 4: Set up event listener to display the DataTable
  selectElement.addEventListener("change", () => {
    const selectedTask = selectElement.value
    if (selectedTask) {
      displayTaskDataTable(selectedTask, dataTableContainerId)
    }
  })
}

function displayTaskDataTable(taskName, containerId) {
  // Step 5: Filter the tasksWithNames to get the relevant rows
  const filteredTasks = tasksWithNames.filter((task) => task.name === taskName)

  // Clear previous table content
  const container = document.getElementById(containerId)
  container.innerHTML = `<h3>Task Details for "${taskName}"</h3>`

  // Create and append the table
  const table = document.createElement("table")
  table.id = "task-details-table"
  table.className = "display"
  container.appendChild(table)

  // Initialize the DataTable
  $("#task-details-table").DataTable({
    data: filteredTasks,
    destroy: true, // Recreate the table each time
    columns: [
      { data: "taskId", title: "Task Id", visible: false },
      { data: "createdAt", title: "Created Date", visible: true },
      { data: "updatedAt", title: "Updated Date", visible: true },
      { data: "createdById", title: "Created By Id", visible: false },
      { data: "formVersionId", title: "Form Version Id", visible: false },
      { data: "deadline", title: "Deadline", visible: true },
      { data: "name", title: "Task Name", visible: true },
      { data: "description", title: "Task Description", visible: true },
      { data: "status", title: "Task Completed", visible: true },
      { data: "milestoneName", title: "Milestone Name", visible: true },
      { data: "milestoneDescription", title: "Milestone Description", visible: true },
      { data: "taskLogCreatedAt", title: "Task Log Date", visible: true },
      { data: "taskLogStatus", title: "Task Log Completed", visible: true },
      { data: "taskLogMetadata", title: "Form Data", visible: true },
      { data: "completedById", title: "Completed By Id", visible: false },
      { data: "assignedToId", title: "Assigned To Id", visible: false },
      { data: "roles", title: "Roles", visible: true },
      { data: "assignedTo", title: "Assigned To", visible: true },
      { data: "completedBy", title: "Completed By", visible: true },
    ],
    paging: true,
    searching: true,
    ordering: true,
    responsive: true,
    scrollX: true,
    dom: "frtipB",
    buttons: [
      {
        extend: "csvHtml5",
        text: "Download CSV",
        title: `${taskName}_Task_Data`,
        className: "btn btn-primary",
        exportOptions: {
          columns: ":visible", // Export visible columns only
          format: {
            header: function (data, columnIdx) {
              return $(table).DataTable().settings().init().columns[columnIdx].title || ""
            },
          },
        },
      },
      {
        extend: "excelHtml5",
        text: "Download Excel",
        title: `${taskName}_Task_Data`,
        className: "btn btn-success",
        exportOptions: {
          columns: ":visible", // Export visible columns only
          format: {
            header: function (data, columnIdx) {
              return $(table).DataTable().settings().init().columns[columnIdx].title || ""
            },
          },
        },
      },
    ],
    language: {
      search: "Search All: ", // Customize the search label
    },
    initComplete: function () {
      // Optional: Add custom search inputs for each column
      this.api()
        .columns()
        .every(function () {
          const column = this
          const header = $(column.header())
          const input = $('<input type="text" placeholder="Search ' + header.text() + '" />')
            .appendTo($(header).empty())
            .on("keyup change clear", function () {
              if (column.search() !== this.value) {
                column.search(this.value).draw()
              }
            })
        })
    },
  })
}

// Call the function to create the dropdown and set up the table display
createTaskDropdownAndDataTable("task-dropdown-container", "task-datatable-container")
```

<div class ="card">
  <div class="card-title">
    <h1>Overall Task Statistics</h1>
  </div>
  <p>This page displays statistics and information about tasks assigned in the project. Tasks completed indicate the number of tasks marked as completed by the project manager while the task logs completed indicates the number of member marked completed tasks.</p>

  <div class="statistics-container">
    <div class="stat-card">
      <h4>Tasks Completed</h4>
      <p id="completed-tasks-chart"></p>
    </div>
    <div class="stat-card">
      <h4>Task Logs Completed</h4>
      <p id="completed-tasklogs-chart"></p>
    </div>
    <div class="stat-card">
        <h4>Average Completion Time</h4>
        <p id="stat-number-3">${averageCompletionTime} Days</p>
        <i class="fas fa-clock" id="stat-number-3" aria-hidden="true"></i>
      </div>
  </div>
</div>

<div class="custom-collapse">
  <input type="checkbox" class="toggle-checkbox" id="collapse-toggle-tasks-combined"> 
  <label for="collapse-toggle-tasks-combined" class="collapse-title">
    <div class="card-title" id="tasks-combined"><h1>View Task Logs</h1></div>
    <i class="expand-icon">+</i>
  </label>
  <div class="collapse-content">
    <p>This table includes task log data filtered by the selected task, along with their assigned roles, statuses, and form data. You can download the information using the buttons below.</p>
    <div id="task-dropdown-container" class="dropdown-container"></div>
    <div id="task-datatable-container" class="datatable-container"></div>
  </div>
</div>

---
title: Event Timeline
toc: false
---

<link rel="stylesheet" href="https://unpkg.com/cal-heatmap@4.2.4/dist/cal-heatmap.css">
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://unpkg.com/cal-heatmap@4.2.4/dist/cal-heatmap.min.js"></script>
<script src="https://unpkg.com/cal-heatmap/dist/plugins/Legend.min.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css">
<script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
<link rel="stylesheet" href="style.css">

```js libraries
// imports
import * as Plot from "npm:@observablehq/plot"
import * as d3 from "npm:d3"
import CalHeatmap from "npm:cal-heatmap"
import Legend from "npm:cal-heatmap/plugins/Legend"
import Tooltip from "npm:cal-heatmap/plugins/Tooltip"
import Plotly from "npm:plotly.js-dist"
```

```js data
//data
const jsonData = FileAttachment("./data/project_summary.json").json()
```

```js create-timeline-data
// Extract tasks and create timeline events
const tasks = jsonData.tasks ?? []
const projectMembers = jsonData.projectMembers ?? []
const projectName = jsonData.name || "Unnamed Project" // Fallback if name is missing
const projectCreatedAt = jsonData.createdAt || null // Check for project creation date
const milestones = jsonData.milestones ?? []

// Map projectMembers by their `id` for quick lookup
const projectMembersById = Object.fromEntries(
  projectMembers.flatMap((member) =>
    (member.users ?? []).map((user) => [
      member.id,
      { username: user.username, firstName: user.firstName, lastName: user.lastName },
    ])
  )
)

// Create timeline events from tasks, logs, project members, project creation, and element creation
let timelineEvents = [
  // Add project creation event
  ...(projectCreatedAt
    ? [
        {
          name: `Project Created: ${projectName}`,
          date: projectCreatedAt,
          type: "Project Creation",
        },
      ]
    : []),

  // Add task creation, deadlines, and logs
  ...tasks.flatMap((task) => {
    const taskCreation = task.createdAt
      ? [{ name: task.name, date: task.createdAt, type: "Task Created" }]
      : []
    const taskDeadline = task.deadline
      ? [{ name: task.name, date: task.deadline, type: "Deadline" }]
      : []
    const taskLogs = (task.taskLogs ?? [])
      .filter((log) => log.status !== "NOT_COMPLETED") // Exclude NOT_COMPLETED logs
      .map((log) => {
        const completer = projectMembersById[log.completedById] || {}
        const completerName =
          [completer.firstName, completer.lastName].filter(Boolean).join(" ") || "Unknown Completer"
        return {
          name: `${task.name} (Completed by: ${completer.username || completerName})`,
          date: log.createdAt,
          type: "Task Completed",
        }
      })
    return [...taskCreation, ...taskDeadline, ...taskLogs]
  }),

  // Add milestone events (created, start, end), deduplicated by milestone ID
  ...(() => {
    const milestoneMap = new Map()
    milestones.forEach((m) => {
      if (m && m.id && !milestoneMap.has(m.id)) {
        milestoneMap.set(m.id, m)
      }
    })
    return [...milestoneMap.values()].flatMap((m) => {
      const events = []
      if (m.createdAt)
        events.push({ name: `${m.name}`, date: m.createdAt, type: "Milestone Created" })
      if (m.startDate)
        events.push({ name: `${m.name}`, date: m.startDate, type: "Milestone Start" })
      if (m.endDate) events.push({ name: `${m.name}`, date: m.endDate, type: "Milestone End" })
      return events
    })
  })(),

  // Add project member events
  ...projectMembers.flatMap((member) => {
    const users = member.users ?? [] // Access nested users array safely
    const memberName = member.name || "the project" // Fallback to "the project" if name is missing
    const isTeam = users.length > 1 // Check if there are multiple users

    return users.map((user) => {
      const username = user.username || "Unknown Username"
      const firstName = user.firstName || ""
      const lastName = user.lastName || ""
      const fullName = [firstName, lastName].filter(Boolean).join(" ") // Join only non-empty parts

      // Create the event name
      const eventName = isTeam
        ? `Team member added to ${memberName}: ${username} (${fullName || "No Name Provided"})`
        : `${username}: ${fullName || "No Name Provided"}`

      return {
        name: eventName,
        date: member.createdAt,
        type: "Project Member Added",
      }
    })
  }),
]

// Remove duplicate events based on `name`, `date`, and `type`
timelineEvents = timelineEvents.filter(
  (event, index, self) =>
    index ===
    self.findIndex((e) => e.name === event.name && e.date === event.date && e.type === event.type)
)

// Sort timeline events by date
timelineEvents.sort((a, b) => new Date(a.date) - new Date(b.date))

//format date for heatmap
timelineEvents = timelineEvents.map((event) => ({
  ...event,
  dateFormat: new Date(event.date).toISOString().split("T")[0],
}))
```

```js aggregate-by-date
// Aggregate events by date
const eventsByDate = d3.rollups(
  timelineEvents,
  (v) => v.length, // Count the number of events on each date
  (d) => d.dateFormat // Group by the formatted date
)

const formattedEvents = eventsByDate.map(([date, value]) => ({
  date,
  value,
}))
```

```js timeline-table
function createTimelineEventsTable() {
  // Create a table container dynamically
  const container = document.getElementById("timeline-events-container")
  if (!container) {
    console.error("Table container for timeline not found!")
    return
  }

  // Create the table element
  const table = document.createElement("table")
  table.id = "timeline-events-table"
  table.className = "display"

  // Clear the container and append the table
  container.innerHTML = ""
  container.appendChild(table)
  // Initialize DataTable directly with timelineEvents as the data source
  $("#timeline-events-table").DataTable({
    data: timelineEvents, // Directly use timelineEvents as the data source
    destroy: true, // Recreate the table each time
    columns: [
      { data: "name", title: "Event Name" },
      {
        data: "date",
        title: "Event Date",
      },
      { data: "type", title: "Event Type" },
    ],
    paging: true,
    searching: true,
    ordering: true,
    responsive: true,
    dom: "frtipB",
    buttons: [
      {
        extend: "csvHtml5",
        text: "Download CSV",
        title: "Timeline_Events",
        className: "btn btn-primary",
        exportOptions: {
          columns: ":visible", // Export visible columns only
          format: {
            header: function (data, columnIdx) {
              return $("#timeline-events-table thead th").eq(columnIdx).text().trim()
            },
          },
        },
      },
      {
        extend: "excelHtml5",
        text: "Download Excel",
        title: "Timeline_Events",
        className: "btn btn-success",
        exportOptions: {
          columns: ":visible", // Export visible columns only
          format: {
            header: function (data, columnIdx) {
              return $("#timeline-events-table thead th").eq(columnIdx).text().trim()
            },
          },
        },
      },
    ],
    order: [[1, "asc"]],
    language: {
      search: "Search All: ", // Customize the label for the search box
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

// Call the function to initialize the DataTable
createTimelineEventsTable()
```

```js calheatmap
const schemes = {
  sequential: [
    "blues",
    "greens",
    "greys",
    "oranges",
    "purples",
    "reds",
    "bugn",
    "bupu",
    "gnbu",
    "orrd",
    "pubu",
    "pubugn",
    "purd",
    "rdpu",
    "ylgn",
    "ylgnbu",
    "ylorbr",
    "ylorrd",
    "cividis",
    "inferno",
    "magma",
    "plasma",
    "viridis",
    "cubehelix",
    "turbo",
    "warm",
    "cool",
  ],
}

function createDropdownsAndRepaintHeatmap(containerId, heatmapContainerId) {
  const intervals = [
    { value: 0, label: "Year - Month" },
    { value: 1, label: "Year - Week" },
    { value: 2, label: "Year - Day" },
    { value: 3, label: "Month - Week" },
    { value: 4, label: "Month - Day" },
  ]

  const colorSchemes = schemes.sequential

  const dropdownContainer = document.getElementById(containerId)
  dropdownContainer.innerHTML = `
    <h3>Select Time Interval and Color Scheme</h3>
    <select id="interval-select" class="interval-select"></select>
    <select id="color-select" class="color-scheme-select"></select>
  `

  const intervalSelect = document.getElementById("interval-select")
  intervals.forEach((interval) => {
    const option = document.createElement("option")
    option.value = interval.value
    option.textContent = interval.label
    intervalSelect.appendChild(option)
  })
  intervalSelect.value = "4" // Default to Month - Day

  const colorSelect = document.getElementById("color-select")
  colorSchemes.forEach((scheme) => {
    const option = document.createElement("option")
    option.value = scheme
    option.textContent = scheme.charAt(0).toUpperCase() + scheme.slice(1)
    colorSelect.appendChild(option)
  })
  colorSelect.value = "blues"

  repaintHeatmap(parseInt(intervalSelect.value), colorSelect.value, heatmapContainerId)

  intervalSelect.addEventListener("change", () => {
    repaintHeatmap(parseInt(intervalSelect.value), colorSelect.value, heatmapContainerId)
  })

  colorSelect.addEventListener("change", () => {
    repaintHeatmap(parseInt(intervalSelect.value), colorSelect.value, heatmapContainerId)
  })
}

let cal

function repaintHeatmap(intervalIndex, colorScheme, heatmapContainerId) {
  document.getElementById(heatmapContainerId).innerHTML = ""

  const intervals = {
    0: ["year", "month"],
    1: ["year", "week"],
    2: ["year", "day"],
    3: ["month", "week"],
    4: ["month", "day"],
  }

  const minDate = d3.min(formattedEvents, (d) => new Date(d.date))
  const maxDate = new Date(
    new Date(d3.max(formattedEvents, (d) => new Date(d.date))).getFullYear(),
    11,
    31
  )

  const maxValue = d3.max(formattedEvents, (d) => d.value) || 20

  // Calculate min and max years, and the dynamic range of years
  const minYear = minDate.getFullYear()
  const maxYear = maxDate.getFullYear()
  const yearRange = maxYear - minYear + 1 // Ensure it covers all years

  // Dynamically determine range: 1 year for "Year-Month" intervals, else use calculated range
  let range = intervals[intervalIndex][0] === "year" ? yearRange : 12

  const colorDomain = [0, 1, 2, 3, 4, maxValue]

  cal = new CalHeatmap()
  cal.paint(
    {
      date: { start: minDate, end: maxDate },
      range: range,
      data: {
        source: formattedEvents,
        x: "date",
        y: "value",
      },
      scale: {
        color: { type: "linear", scheme: colorScheme, domain: colorDomain },
      },
      itemSelector: `#${heatmapContainerId}`,
      domain: { type: intervals[intervalIndex][0] },
      subDomain: {
        type: intervals[intervalIndex][1],
        width: 15, // Increase cell width
        height: 15,
        radius: 3,
      },
      subDomainTextFormat: "%d",
      legend: colorDomain,
      legendContainer: "#cal-legend-container",
      domainDynamicDimension: false,
    },
    [
      [
        Legend,
        {
          container: "#cal-legend-container",
          label: "Event Count",
          width: 500,
          ticks: 5, // Number of legend ticks
          padding: [10, 10], // Space around legend
        },
      ],
      [
        Tooltip,
        {
          enabled: true,
          text: (timestamp, value) => {
            const date = new Date(timestamp)
            return `<strong>Date:</strong> ${date.toLocaleDateString()}<br><strong>Events:</strong> ${
              value || 0
            }`
          },
        },
      ],
    ]
  )
}

createDropdownsAndRepaintHeatmap("interval-dropdown-container", "cal-heatmap-index")
```

```js milestone-gantt-chart
const milestoneDataRaw = (jsonData.milestones || []).filter(
  (m) => m.startDate && m.endDate && m.id && m.name
)
// Sort by startDate (oldest first), then reverse so oldest milestones appear at the top
milestoneDataRaw.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).reverse()

const tickvals = []
const ticktext = []
const allChartData = []

milestoneDataRaw.forEach((m) => {
  const milestoneId = String(m.id)

  const milestoneTasks = (jsonData.tasks || []).filter(
    (t) => t.milestoneId === m.id && t.startDate && t.deadline
  )

  milestoneTasks.forEach((t) => {
    const yLabel = `task-${t.id}`
    tickvals.push(yLabel)
    ticktext.push("↳ " + t.name)

    allChartData.push({
      x: [t.startDate, t.deadline],
      y: [yLabel, yLabel],
      type: "scatter",
      mode: "lines",
      line: { width: 6, color: "orange" },
      name: t.name,
      text: t.name,
      hovertemplate: `
        <b>Task:</b> ${t.name}<br>
        Start: ${new Date(t.startDate).toLocaleDateString()}<br>
        End: ${new Date(t.deadline).toLocaleDateString()}<extra></extra>
      `,
    })
  })

  tickvals.push(milestoneId)
  ticktext.push(m.name)

  allChartData.push({
    x: [m.startDate, m.endDate],
    y: [milestoneId, milestoneId],
    type: "scatter",
    mode: "lines",
    line: { width: 20 },
    name: m.name,
    text: m.name,
    hovertemplate: `
      <b>${m.name}</b><br>
      Start: ${new Date(m.startDate).toLocaleDateString()}<br>
      End: ${new Date(m.endDate).toLocaleDateString()}<extra></extra>
    `,
  })
})

const layout = {
  title: "Milestone Timeline",
  xaxis: {
    type: "date",
    title: { text: "Date", font: { size: 16 } },
    tickformat: "%b %d",
    tickfont: { size: 14 },
  },
  yaxis: {
    //title: { text: "Milestones", font: { size: 16 } },
    tickvals,
    ticktext,
    type: "category",
    automargin: true,
    tickfont: { size: 14 },
  },
  height: milestoneDataRaw.length * 40 + 100,
  showlegend: false,
  margin: { l: 150, r: 30, t: 50, b: 40 },
}

Plotly.newPlot("milestone-gantt-container", allChartData, layout)
```

```js milestone-table
function createMilestoneTable() {
  const container = document.getElementById("milestone-table-container")
  if (!container) return

  const table = document.createElement("table")
  table.id = "milestone-task-table"
  table.className = "display"

  container.innerHTML = ""
  container.appendChild(table)

  const rows = []

  for (const m of jsonData.milestones || []) {
    if (m.startDate && m.endDate) {
      rows.push({
        name: m.name,
        type: "Milestone",
        start: m.startDate,
        end: m.endDate,
      })
    }

    for (const t of jsonData.tasks || []) {
      if (t.milestoneId === m.id && t.startDate && t.deadline) {
        rows.push({
          name: "↳ " + t.name,
          type: "Task",
          start: t.startDate,
          end: t.deadline,
        })
      }
    }
  }

  $("#milestone-task-table").DataTable({
    data: rows,
    destroy: true,
    columns: [
      { data: "name", title: "Name" },
      { data: "type", title: "Type" },
      { data: "start", title: "Start Date" },
      { data: "end", title: "End Date" },
    ],
    paging: true,
    searching: true,
    ordering: true,
    responsive: true,
    dom: "frtipB",
    buttons: [
      {
        extend: "csvHtml5",
        text: "Download CSV",
        title: "Milestone_Task_Timeline",
        className: "btn btn-primary",
        exportOptions: {
          columns: ":visible",
        },
      },
      {
        extend: "excelHtml5",
        text: "Download Excel",
        title: "Milestone_Task_Timeline",
        className: "btn btn-success",
        exportOptions: {
          columns: ":visible",
        },
      },
    ],
    order: [[2, "asc"]],
    language: {
      search: "Search All: ",
    },
  })
}

createMilestoneTable()
```

<div class ="card">
  <div class="card-title">
    <h1>Timeline Events</h1>
  </div>
  <div class="card-container">
    <div id="interval-dropdown-container"></div>
    <div id="cal-heatmap-container" class="scrollable-heatmap">
      <div id="cal-heatmap-index"></div>
    </div>
    <div id="cal-legend-container" class="cal-legend-container"></div>
  </div>
</div>

<div class="custom-collapse">
  <input type="checkbox" class="toggle-checkbox" id="collapse-toggle-timeline"> 
  <label for="collapse-toggle-timeline" class="collapse-title">
    <div class="card-title" id="timeline"><h1>Timeline Data</h1></div>
    <i class="expand-icon">+</i>
  </label>
  <div class="collapse-content">
    <p>This table includes the timeline data used to create the heatmap shown above. You can download the information using the buttons below.</p>
    <div id="timeline-events-container"></div> <!-- Placeholder for the table -->
  </div>
</div>

<div class="custom-collapse">
  <input type="checkbox" class="toggle-checkbox" id="collapse-toggle-milestone"> 
  <label for="collapse-toggle-milestone" class="collapse-title">
    <div class="card-title" id="milestone"><h1>Milestone Gantt Chart</h1></div>
    <i class="expand-icon">+</i>
  </label>
  <div class="collapse-content">
    <div id="milestone-gantt-container"></div>
  </div>
</div>

<div class="custom-collapse">
  <input type="checkbox" class="toggle-checkbox" id="collapse-toggle-milestonetable"> 
  <label for="collapse-toggle-milestonetable" class="collapse-title">
    <div class="card-title" id="milestonetable"><h1>Milestone Table</h1></div>
    <i class="expand-icon">+</i>
  </label>
  <div class="collapse-content">
    <p>This table includes all milestones and their associated tasks with start and end dates. You can download the information using the buttons below.</p>
    <div id="milestone-table-container"></div>
  </div>
</div>

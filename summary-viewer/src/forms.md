---
title: Contributors
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

```js packages
const jsonData = FileAttachment("./data/project_summary.json").json()
import * as Plot from "npm:@observablehq/plot"
import * as d3 from "npm:d3"
```

```js form-data
function extractFinalSubmittedMetadata(jsonData) {
  // Step 1: Use a map to track the final submission for each task-person combination
  const finalSubmissionMap = new Map()

  jsonData.tasks.forEach((task) => {
    task.taskLogs.forEach((log) => {
      if (log.metadata && log.metadata !== "No Metadata") {
        const key = `${task.id}-${log.assignedToId}` // Unique key per task-person combo

        // If key doesn't exist or if this log is later, update the map
        if (
          !finalSubmissionMap.has(key) ||
          new Date(log.createdAt) > new Date(finalSubmissionMap.get(key).taskLogCreatedAt)
        ) {
          finalSubmissionMap.set(key, {
            taskId: task.id,
            taskName: task.name || "Unnamed Task",
            assignedToId: log.assignedToId || "Unknown",
            taskLogCreatedAt: log.createdAt,
            metadata: log.metadata, // Store the metadata
          })
        }
      }
    })
  })

  // Step 2: Convert the map values to an array and return
  return Array.from(finalSubmissionMap.values())
}

// Example usage:
const finalMetadataArray = extractFinalSubmittedMetadata(jsonData)
```

```js create-data-table-metadata
function createMetadataDropdownAndDataTable(containerId, dataTableContainerId) {
  // Step 1: Get unique task names from the metadata array
  const taskNames = [...new Set(finalMetadataArray.map((entry) => entry.taskName))]

  // Step 2: Create the dropdown menu
  const dropdownContainer = document.getElementById(containerId)
  dropdownContainer.innerHTML = "<h3>Select a Task</h3>"

  const selectElement = document.createElement("select")
  selectElement.className = "metadata-select"
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
      displayDynamicMetadataTable(selectedTask, dataTableContainerId)
    }
  })
}

function displayDynamicMetadataTable(selectedTaskName, containerId) {
  // Step 5: Filter metadata for the selected task name
  const filteredMetadata = finalMetadataArray.filter((entry) => entry.taskName === selectedTaskName)

  // Step 6: Convert metadata to table data and get dynamic columns
  const { tableData, allKeys } = convertMetadataToTableData(filteredMetadata)

  // Clear previous table content
  const container = document.getElementById(containerId)
  container.innerHTML = `<h3>Metadata Table for "${selectedTaskName}"</h3>`

  // Create and append the table
  const table = document.createElement("table")
  table.id = "dynamic-metadata-table"
  table.className = "display"
  container.appendChild(table)

  // Initialize DataTable with dynamic columns
  $("#dynamic-metadata-table").DataTable({
    data: tableData,
    destroy: true, // Recreate the table each time
    columns: [
      { data: "taskName", title: "Task Name" },
      {
        data: "assignedToId",
        title: "Assigned To",
        render: function (data) {
          return convertAssignedToIdToName(data) // Convert ID to name
        },
      },
      { data: "taskLogCreatedAt", title: "Log Created At" },
      ...allKeys.map((key) => ({ data: key, title: key })), // Dynamically add metadata columns
    ],
    paging: true,
    searching: true,
    ordering: true,
    responsive: true,
    scrollX: true,
    dom: "frtipB", // Enable buttons for export
    buttons: [
      {
        extend: "csvHtml5",
        text: "Download CSV", // Customize button text
        title: `${selectedTaskName}_Metadata`,
        className: "btn btn-primary", // Optional: Add a CSS class
        exportOptions: {
          columns: ":visible", // Export visible columns only
          format: {
            header: function (data, columnIdx) {
              return $("#dynamic-metadata-table thead th").eq(columnIdx).text().trim()
            },
          },
        },
      },
      {
        extend: "excelHtml5",
        text: "Download Excel",
        title: `${selectedTaskName}_Metadata`,
        className: "btn btn-success", // Optional: Add a CSS class
        exportOptions: {
          columns: ":visible", // Export visible columns only
          format: {
            header: function (data, columnIdx) {
              return $("#dynamic-metadata-table thead th").eq(columnIdx).text().trim()
            },
          },
        },
      },
    ],
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

function convertAssignedToIdToName(assignedToId) {
  // Find the project member by assignedToId
  const member = jsonData.projectMembers.find((member) => member.id === assignedToId)
  if (!member) {
    return "Unknown" // Handle cases where no member is found
  }
  // Use member.name if available
  if (member.name) {
    return member.name
  }
  // Otherwise, combine first name, last name, and username
  const user = member.users[0] // Assuming users array exists and has at least one user
  if (user) {
    const firstName = user.firstName || ""
    const lastName = user.lastName || ""
    // Check if both names are empty or null
    if (!firstName.trim() && !lastName.trim()) {
      return "No Name Provided"
    }
    return `${firstName} ${lastName} (${user.username})`.trim()
  }
  return "Unknown"
}

function convertMetadataToTableData(metadataArray) {
  // Collect all unique metadata keys
  const allKeys = new Set()
  metadataArray.forEach((entry) => {
    Object.keys(entry.metadata).forEach((key) => allKeys.add(key))
  })

  // Convert metadata to table-friendly rows
  const tableData = metadataArray.map((entry) => {
    const row = {
      taskId: entry.taskId, // No longer included in DataTable display
      taskName: entry.taskName,
      assignedToId: entry.assignedToId,
      taskLogCreatedAt: entry.taskLogCreatedAt,
    }

    // Fill metadata dynamically
    allKeys.forEach((key) => {
      row[key] = entry.metadata[key] || "N/A" // Handle missing keys
    })

    return row
  })

  return { tableData, allKeys: Array.from(allKeys) }
}

// Call the function to initialize the dropdown and DataTable
createMetadataDropdownAndDataTable("metadata-dropdown-container", "metadata-datatable-container")
```

<div class ="card">
  <div class="card-title">
    <h1>Form Data</h1>
  </div>
  <p>This page displays statistics and information about tasks assigned in the project. Tasks completed indicate the number of tasks marked as completed by the project manager while the task logs completed indicates the number of member marked completed tasks.</p>

  <div class="card-container">
    <div id="metadata-dropdown-container" class="dropdown-container"></div>
    <div id="metadata-datatable-container" class="datatable-container"></div>
  </div>
</div>

/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { render, screen } from "test/utils"
import { TaskView } from "./UtilsViews"

const getSimpleTestTask = () => {
  const createdAtStr: string = "2024-03-27 11:43 PM"
  const task1CreatedAt: Date = new Date(createdAtStr)
  const userLastName = "user lastname"
  const userFirstName = "user firstname"
  const task1 = {
    name: "task1",
    description: "a task test ",
    createdAt: task1CreatedAt,
    createdBy: {
      user: {
        id: 1,
        username: "user1",
        lastName: userLastName,
        firstName: userFirstName,
      },
    },
    assignees: [] as any,
    labels: [] as any,
    element: undefined as any,
  }
  return task1
}

const getExtendedTestTask = () => {
  const element = {
    id: 1,
    name: "element1",
  }
  const labels = [
    {
      id: 1,
      name: "label1",
    },
    {
      id: 2,
      name: "label2",
    },
  ]
  const assignees = [
    {
      id: 1,
      statusLogs: [],
      team: {
        name: "team1",
        id: 2,
      },
    },
    {
      id: 2,
      statusLogs: [],
      contributor: {
        id: 1,
        user: {
          firstName: "contributor_first",
          lastName: "contributor_last",
          id: 1,
        },
      },
    },
  ]
  let task1 = getSimpleTestTask()
  task1.assignees = assignees
  task1.element = element
  task1.labels = labels
  return task1
}

test("renders Only Utils/Task view ", async () => {
  const task1 = getSimpleTestTask()
  const { debug } = render(
    <TaskView task={task1} printLabels={true} printAssignees={true} printElement={true}></TaskView>
  )

  const taskView = screen.getByTestId("taskview-testid")
  expect(taskView).toBeInTheDocument()
  expect(screen.getByText(/user firstname/i)).toBeInTheDocument()
  expect(screen.getByText(/user lastname/i)).toBeInTheDocument()
  expect(screen.getByRole("heading", { name: /name: task1/i }))
  expect(screen.getByText("This task does not have labels")).toBeInTheDocument()
  expect(screen.getByText("This task does not have element")).toBeInTheDocument()
  expect(screen.getByText("March 27, 2024 at 23:43:00")).toBeInTheDocument()

  expect(screen.queryByText("Completed as")).not.toBeInTheDocument()
  expect(screen.queryByText("Contribution Categories")).not.toBeInTheDocument()
  expect(screen.queryByText("Element")).not.toBeInTheDocument()
})

test("renders Utils/Task view with subelements", async () => {
  const task1 = getExtendedTestTask()
  const { debug } = render(
    <TaskView task={task1} printLabels={true} printAssignees={true} printElement={true}></TaskView>
  )
  debug()

  const taskView = screen.getByTestId("taskview-testid")
  expect(taskView).toBeInTheDocument()
  expect(screen.getByText(/label1/i)).toBeInTheDocument()
  expect(screen.getByText(/label2/i)).toBeInTheDocument()
  expect(screen.queryByText(/label3/i)).not.toBeInTheDocument()
  expect(screen.getByText(/element: element1/i)).toBeInTheDocument()
  expect(screen.getByText(/team name: team1/i)).toBeInTheDocument()
  expect(
    screen.getByText(/contributor name: contributor_first contributor_last/i)
  ).toBeInTheDocument()
  expect(screen.queryByText("This task does not have assignees")).not.toBeInTheDocument()
  expect(screen.queryByText("This task does not have labels")).not.toBeInTheDocument()
  expect(screen.queryByText("This task does not have element")).not.toBeInTheDocument()
  expect(screen.getByText("March 27, 2024 at 23:43:00")).toBeInTheDocument()

  expect(screen.queryByText("Completed as")).not.toBeInTheDocument()
  expect(screen.getByText(/contribution categories:/i)).toBeInTheDocument()
})

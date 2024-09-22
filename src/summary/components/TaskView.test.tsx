/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { render, screen } from "test/utils"
import { TaskView } from "./UtilsViews"

test("renders Only Utils/Task view ", async () => {
  const createdAtStr: string = "2024-03-27 11:43 PM"
  const task1CreatedAt: Date = new Date(createdAtStr)
  const exptask1CreatedAt = "March 27, 2024 at 23:43:00"
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
    assignees: [],
    labels: [],
    element: undefined,
  }

  const { debug } = render(
    <TaskView task={task1} printLabels={true} printAssignees={true} printElement={true}></TaskView>
  )

  const taskView = screen.getByTestId("taskview-testid")
  expect(taskView).toBeInTheDocument()
  expect(screen.getByText(/user firstname/i)).toBeInTheDocument()
  expect(screen.getByText(/user lastname/i)).toBeInTheDocument()
  expect(screen.getByRole("heading", { name: /name: task1/i }))
  expect(screen.getByText("This task does not have assignees")).toBeInTheDocument()
  expect(screen.getByText("This task does not have labels")).toBeInTheDocument()
  expect(screen.getByText("This task does not have element")).toBeInTheDocument()
  expect(screen.getByText(exptask1CreatedAt)).toBeInTheDocument()

  expect(screen.queryByText("Completed as")).not.toBeInTheDocument()
  expect(screen.queryByText("Contribution Categories")).not.toBeInTheDocument()
  expect(screen.queryByText("Element")).not.toBeInTheDocument()
})

//TODO: needs to add status log, after fix resend keys to run app
test("renders Utils/Task view with subelements", async () => {
  const createdAtStr: string = "2024-03-27 11:43 PM"
  const task1CreatedAt: Date = new Date(createdAtStr)
  const exptask1CreatedAt = "March 27, 2024 at 23:43:00"
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
    assignees: [
      {
        statusLogs: [],
        team: {
          name: "team1",
          id: 1,
        },
      },
      {
        statusLogs: [],
        contributor: {
          user: {
            firstName: "contributor_first",
            lastName: "contributor_last",
            id: 1,
          },
        },
      },
    ],
    labels: [
      {
        id: 1,
        name: "label1",
      },
      {
        id: 2,
        name: "label2",
      },
    ],
    element: {
      id: 1,
      name: "element1",
    },
  }

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
  expect(screen.getByText(exptask1CreatedAt)).toBeInTheDocument()

  expect(screen.queryByText("Completed as")).not.toBeInTheDocument()
  expect(screen.getByText(/contribution categories:/i)).toBeInTheDocument()
})

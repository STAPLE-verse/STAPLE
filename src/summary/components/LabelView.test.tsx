/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest"
import { render, screen } from "test/utils"
import { LabelView } from "./UtilsViews"

test("renders Only Utils/Label view ", async () => {
  const label1 = {
    name: "label1",
    description: "a label test ",
    taxonomy: "label taxonomy",
  }

  render(
    <LabelView
      label={label1}
      contributors={[]}
      tasks={undefined}
      printContributor={true}
      printTask={false}
    ></LabelView>
  )

  const elView = screen.getByTestId("labelview-testid")
  expect(elView).toBeInTheDocument()
  expect(
    screen.getByText(/description: a label test taxonomy: label taxonomy/i)
  ).toBeInTheDocument()
  expect(screen.getByRole("heading", { name: /name: label1/i })).toBeInTheDocument()
  expect(
    screen.getByRole("heading", {
      name: /this label does not have contributors/i,
    })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole("heading", {
      name: /this label does not have tasks/i,
    })
  ).not.toBeInTheDocument()
})

test("renders  Utils/Label view with contributors  ", async () => {
  const label1 = {
    name: "label1",
    description: "a label test ",
    taxonomy: "label taxonomy",
  }
  const contributors = [
    {
      id: 1,
      user: {
        firstName: "username",
        lastName: "userlast",
      },
    },
  ]

  render(
    <LabelView
      label={label1}
      contributors={contributors}
      tasks={[]}
      printContributor={true}
      printTask={true}
    ></LabelView>
  )

  const elView = screen.getByTestId("labelview-testid")
  expect(elView).toBeInTheDocument()
  expect(
    screen.getByRole("heading", {
      name: /contributors/i,
    })
  ).toBeInTheDocument()
  expect(screen.getByText(/user: username userlast/i)).toBeInTheDocument()
  expect(
    screen.getByRole("heading", {
      name: /this label does not have tasks/i,
    })
  ).toBeInTheDocument()

  expect(
    screen.queryByRole("heading", {
      name: /this label does not have contributors/i,
    })
  ).not.toBeInTheDocument()
})

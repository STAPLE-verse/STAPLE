/**
 * @vitest-environment jsdom
 */

import { expect, vi, test } from "vitest"
import { render, screen, fireEvent } from "test/utils"
import { AllLabelsList } from "./AllLabelsList"

test("renders all labels list", async () => {
  let value = ""
  const onChangeHandle = (val) => {
    value = val.currentTarget.value
  }

  const labels = [
    {
      id: 1,
      name: "label1",
      description: "Description_id 1 ",
      taxonomy: "testlabel",
    },
    {
      id: 2,
      name: "label2",
      description: "Description_id 2 ",
      taxonomy: "tasklabel",
    },
  ]
  const taxonomyList = ["taxonomy1"]

  render(
    <AllLabelsList
      labels={labels}
      onChange={onChangeHandle}
      taxonomyList={taxonomyList}
    ></AllLabelsList>
  )

  expect(await screen.getByText("label1")).toBeInTheDocument()
  // const labelsTable = screen.getByTestId("labels-table")
  // expect(labelsTable).toBeInTheDocument()
})

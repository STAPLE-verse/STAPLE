/**
 * @vitest-environment jsdom
 */

import React from "react"
import { fireEvent, render, screen } from "test/utils"
import { expect, test, vi } from "vitest"
import FormPlayground from "./FormPlayground"

vi.mock("@staple-verse/form-studio", async () => {
  const ReactModule = await vi.importActual<typeof import("react")>("react")
  const StudioContext = ReactModule.createContext<any>(undefined)

  return {
    FormStudioProvider: ({ initialSchema, initialUiSchema, children }) => {
      const parse = (value) => (typeof value === "string" ? JSON.parse(value) : value)
      const [state, setState] = ReactModule.useState({
        schema: parse(initialSchema),
        uiSchema: parse(initialUiSchema),
        formData: {},
      })

      return (
        <StudioContext.Provider
          value={{
            state,
            setSchema: (schema) => setState((current) => ({ ...current, schema })),
            setUiSchema: (uiSchema) => setState((current) => ({ ...current, uiSchema })),
          }}
        >
          {children}
        </StudioContext.Provider>
      )
    },
    useFormStudio: () => ReactModule.useContext(StudioContext),
    FormBuilder: ({ schema, uiSchema, onChange }) => (
      <button
        type="button"
        onClick={() =>
          onChange(
            JSON.stringify({ ...JSON.parse(schema), title: "Updated form" }),
            JSON.stringify({ ...JSON.parse(uiSchema), "ui:order": ["field"] })
          )
        }
      >
        Studio Form Builder
      </button>
    ),
    JsonEditor: () => {
      const [draft, setDraft] = ReactModule.useState("")

      return (
        <label>
          Studio JSON Editor
          <input
            aria-label="JSON draft"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </label>
      )
    },
    FormPreview: () => <div>Studio Form Preview</div>,
  }
})

vi.mock("./FormTagEditor", () => ({
  default: () => <div>STAPLE tag metadata</div>,
}))

vi.mock("./FormFolderSelector", () => ({
  default: () => <div>STAPLE folder metadata</div>,
}))

vi.mock("./FormDeployments", () => ({
  default: () => <div>STAPLE form deployments</div>,
}))

vi.mock("src/core/components/CollapseCard", () => ({
  default: ({ children }) => <div>{children}</div>,
}))

test("keeps STAPLE metadata and saves the shared form-studio state", async () => {
  const saveForm = vi.fn()
  const onAutoSave = vi.fn().mockResolvedValue(undefined)

  render(
    <FormPlayground
      formId={7}
      currentVersionId={3}
      initialSchema={JSON.stringify({ type: "object" })}
      initialUiSchema="{}"
      saveForm={saveForm}
      onAutoSave={onAutoSave}
    />
  )

  expect(screen.getByRole("tab", { name: "Information" })).toHaveAttribute("aria-selected", "true")
  expect(screen.getByText("STAPLE tag metadata")).toBeInTheDocument()
  expect(screen.getByText("STAPLE folder metadata")).toBeInTheDocument()
  expect(screen.getByText("STAPLE form deployments")).toBeInTheDocument()

  fireEvent.click(screen.getByRole("tab", { name: "Visual Builder" }))
  fireEvent.click(screen.getByRole("button", { name: "Studio Form Builder" }))
  fireEvent.click(screen.getByRole("button", { name: "Save Form" }))

  expect(saveForm).toHaveBeenCalledWith({
    schema: { type: "object", title: "Updated form" },
    uiSchema: { "ui:order": ["field"] },
    formData: {},
  })

  fireEvent.click(screen.getByRole("tab", { name: "JSON Builder" }))
  expect(screen.getByText("Studio JSON Editor")).toBeInTheDocument()
  fireEvent.change(screen.getByRole("textbox", { name: "JSON draft" }), {
    target: { value: "unfinished JSON" },
  })
  expect(onAutoSave).toHaveBeenCalledWith({
    schema: { type: "object", title: "Updated form" },
    uiSchema: { "ui:order": ["field"] },
    formData: {},
  })

  fireEvent.click(screen.getByRole("tab", { name: "Preview" }))
  expect(screen.getByText("Studio Form Preview")).toBeInTheDocument()

  await Promise.resolve()
  fireEvent.click(screen.getByRole("tab", { name: "JSON Builder" }))
  expect(screen.getByRole("textbox", { name: "JSON draft" })).toHaveValue("unfinished JSON")
})

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
    FormStudioProvider: ({
      extensions = [],
      initialSchema,
      initialUiSchema,
      initialExtensionValues = {},
      children,
    }) => {
      const registeredExtensions = extensions as any[]
      const parse = (value) => (typeof value === "string" ? JSON.parse(value) : value)
      const [state, setState] = ReactModule.useState({
        schema: parse(initialSchema),
        uiSchema: parse(initialUiSchema),
        extensionValues: initialExtensionValues,
        formData: {},
      })

      const setExtensionValue = (extension, value) =>
        setState((current) => {
          const extensionValues = { ...current.extensionValues }
          if (value === undefined) delete extensionValues[extension.id]
          else extensionValues[extension.id] = value
          return { ...current, extensionValues }
        })

      const validateForCommit = () => {
        const diagnostics = registeredExtensions.flatMap((extension) =>
          extension
            .validate({
              schema: state.schema,
              uiSchema: state.uiSchema,
              value: state.extensionValues[extension.id],
            })
            .map((diagnostic) => ({
              ...diagnostic,
              source: extension.id,
              sourceLabel: extension.label,
            }))
        )
        return {
          diagnostics,
          blocked: diagnostics.some((diagnostic) => diagnostic.blocksCommit),
        }
      }

      return (
        <StudioContext.Provider
          value={{
            state,
            extensions: registeredExtensions,
            setSchema: (schema) => setState((current) => ({ ...current, schema })),
            setUiSchema: (uiSchema) => setState((current) => ({ ...current, uiSchema })),
            getExtensionValue: (extension) => state.extensionValues[extension.id],
            setExtensionValue,
            validateForCommit,
            // Deliberately models the debounce window. Save-time validation
            // below must still reject the current invalid state synchronously.
            extensionDiagnostics: [],
          }}
        >
          {children}
        </StudioContext.Provider>
      )
    },
    useFormStudio: () => ReactModule.useContext(StudioContext),
    // Mirrors the real useFormStudioCommit (form-studio v0.2.0-rc.4): reads
    // the same mock context, so FormPlayground's actual attemptCommit call
    // sites are exercised against equivalent validate-then-commit behavior.
    useFormStudioCommit: () => {
      const context = ReactModule.useContext(StudioContext)
      const [commitDiagnostics, setCommitDiagnostics] = ReactModule.useState<any[]>([])
      const blockingDiagnostics = context.extensionDiagnostics.filter(
        (diagnostic) => diagnostic.blocksCommit
      )
      const attemptCommit = (commit: (state: any) => void) => {
        const result = context.validateForCommit()
        if (result.blocked) {
          setCommitDiagnostics(result.diagnostics.filter((diagnostic) => diagnostic.blocksCommit))
          return
        }
        setCommitDiagnostics([])
        commit(context.state)
      }
      return { blockingDiagnostics, commitDiagnostics, attemptCommit }
    },
    FormBuilder: ({ schema, uiSchema, onChange }) => {
      const context = ReactModule.useContext(StudioContext)
      const semanticExtension = context.extensions[0]
      return (
        <div>
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
          <button
            type="button"
            onClick={() =>
              context.setExtensionValue(semanticExtension, {
                bindings: [
                  {
                    fieldPointer: "/properties/field",
                    predicate: "not-an-iri",
                    valueKind: "literal",
                  },
                ],
              })
            }
          >
            Make semantics invalid
          </button>
        </div>
      )
    },
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
    FormStudioDiagnostics: () => null,
  }
})

vi.mock("@staple-verse/form-studio/semantic-v1", () => {
  const semanticV1Extension = {
    id: "semantic-v1",
    label: "Semantic V1",
    getValue: (state) => state.extensionValues["semantic-v1"],
    validate: ({ value }) =>
      value?.bindings?.some((binding) => !binding.predicate.startsWith("https://"))
        ? [
            {
              source: "semantic-v1",
              sourceLabel: "Semantic V1",
              code: "SEMANTIC_COMPONENT_INVALID",
              message: "Invalid semantic component",
              severity: "error",
              blocksCommit: true,
            },
          ]
        : [],
  }
  return {
    semanticV1Extension,
    getSemanticV1Value: semanticV1Extension.getValue,
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
  const semantics = {
    bindings: [
      {
        fieldPointer: "/properties/field",
        predicate: "https://example.org/field",
        valueKind: "literal",
      },
    ],
  }

  render(
    <FormPlayground
      formId={7}
      currentVersionId={3}
      initialSchema={JSON.stringify({ type: "object" })}
      initialUiSchema="{}"
      initialSemantics={JSON.stringify(semantics)}
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
    extensionValues: { "semantic-v1": semantics },
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
    extensionValues: { "semantic-v1": semantics },
    formData: {},
  })

  fireEvent.click(screen.getByRole("tab", { name: "Preview" }))
  expect(screen.getByText("Studio Form Preview")).toBeInTheDocument()

  await Promise.resolve()
  fireEvent.click(screen.getByRole("tab", { name: "JSON Builder" }))
  expect(screen.getByRole("textbox", { name: "JSON draft" })).toHaveValue("unfinished JSON")
})

test("synchronously blocks invalid semantics while live diagnostics are still stale", () => {
  const saveForm = vi.fn()
  const onAutoSave = vi.fn().mockResolvedValue(undefined)

  render(
    <FormPlayground
      initialSchema={JSON.stringify({
        type: "object",
        properties: { field: { type: "string" } },
      })}
      initialUiSchema="{}"
      initialSemantics={JSON.stringify({
        bindings: [
          {
            fieldPointer: "/properties/field",
            predicate: "https://example.org/field",
            valueKind: "literal",
          },
        ],
      })}
      saveForm={saveForm}
      onAutoSave={onAutoSave}
    />
  )

  fireEvent.click(screen.getByRole("button", { name: "Make semantics invalid" }))
  fireEvent.click(screen.getByRole("button", { name: "Save Form" }))

  expect(saveForm).not.toHaveBeenCalled()
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Validation issues must be resolved before saving"
  )

  fireEvent.click(screen.getByRole("tab", { name: "JSON Builder" }))
  expect(onAutoSave).not.toHaveBeenCalled()
})

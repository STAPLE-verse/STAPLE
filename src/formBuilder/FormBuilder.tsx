import React, { ReactElement, useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Alert, Input } from "reactstrap"
import Card from "./Card"
import Section from "./Section"
import Add from "./Add"
import {
  parse,
  stringify,
  checkForUnsupportedFeatures,
  generateElementComponentsFromSchemas,
  addCardObj,
  addSectionObj,
  onDragEnd,
  countElementsFromSchema,
  generateCategoryHash,
  excludeKeys,
  DROPPABLE_TYPE,
} from "./utils"
import DEFAULT_FORM_INPUTS from "./defaults/defaultFormInputs"
import type { Mods, InitParameters, AddFormObjectParametersType } from "./types"

export default function FormBuilder({
  schema,
  uischema,
  onMount,
  onChange,
  mods,
  className,
}: {
  schema: string
  uischema: string
  onMount?: (parameters: InitParameters) => any
  onChange: (schema: string, uischema: string) => any
  mods?: Mods
  className?: string
}): ReactElement {
  const schemaData = parse(schema)
  schemaData.type = "object"
  const uiSchemaData = parse(uischema)
  const allFormInputs = excludeKeys(
    Object.assign({}, DEFAULT_FORM_INPUTS, (mods && mods.customFormInputs) || {}),
    mods && mods.deactivatedFormInputs
  )

  const unsupportedFeatures = checkForUnsupportedFeatures(
    schemaData,
    uiSchemaData,
    allFormInputs
  ).filter(
    (msg) =>
      !msg.includes("Object Property: _stapleSchema") &&
      !msg.includes("Property Parameter: readOnly in _stapleSchema") &&
      !msg.includes("UI Widget: hidden for _stapleSchema") &&
      !msg.includes("UI schema property: _stapleSchema") &&
      !msg.includes("allOf")
  )

  const elementNum = countElementsFromSchema(schemaData)
  const defaultCollapseStates = [...Array(elementNum)].map(() => false)
  const [cardOpenArray, setCardOpenArray] = React.useState(defaultCollapseStates)
  const categoryHash = generateCategoryHash(allFormInputs)

  const [isFirstRender, setIsFirstRender] = useState(true)

  const addProperties: AddFormObjectParametersType = {
    schema: schemaData,
    uischema: uiSchemaData,
    mods: mods,
    onChange: (newSchema: { [key: string]: any }, newUiSchema: { [key: string]: any }) =>
      onChange(stringify(newSchema), stringify(newUiSchema)),
    definitionData: schemaData.definitions,
    definitionUi: uiSchemaData.definitions,
    categoryHash,
  }

  const hideAddButton = schemaData.properties && Object.keys(schemaData.properties).length !== 0

  useEffect(() => {
    if (isFirstRender) {
      if (onMount)
        onMount({
          categoryHash,
        })
      setIsFirstRender(false)
    }
  }, [isFirstRender, onMount, categoryHash])

  return (
    <div className={`formBuilder ${className || ""}`}>
      <Alert
        style={{
          display: unsupportedFeatures.length === 0 ? "none" : "block",
        }}
        color="warning"
      >
        <h5>Unsupported Features:</h5>
        {unsupportedFeatures.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </Alert>
      {(!mods || mods.showFormHead !== false) && (
        <div className="formHead" data-test="form-head">
          <div>
            <h5 data-test="form-name-label">
              {mods && mods.labels && typeof mods.labels.formNameLabel === "string"
                ? mods.labels.formNameLabel
                : "Form Name"}
            </h5>
            <Input
              value={schemaData.title || ""}
              placeholder="Title"
              type="text"
              onChange={(ev) => {
                onChange(
                  stringify({
                    ...schemaData,
                    title: ev.target.value,
                  }),
                  uischema
                )
              }}
              className="form-title"
            />
          </div>
          <div>
            <h5 data-test="form-description-label">
              {mods && mods.labels && typeof mods.labels.formDescriptionLabel === "string"
                ? mods.labels.formDescriptionLabel
                : "Form Description"}
            </h5>
            <Input
              value={schemaData.description || ""}
              placeholder="Description"
              type="text"
              onChange={(ev) =>
                onChange(
                  stringify({
                    ...schemaData,
                    description: ev.target.value,
                  }),
                  uischema
                )
              }
              className="form-description"
            />
          </div>
        </div>
      )}
      <div className="form-body formBody">
        {/* @ts-expect-error children the droppable*/}
        <DragDropContext
          onDragEnd={(result) =>
            onDragEnd(result, {
              schema: schemaData,
              uischema: uiSchemaData,
              onChange: (newSchema, newUiSchema) =>
                onChange(stringify(newSchema), stringify(newUiSchema)),
              definitionData: schemaData.definitions,
              definitionUi: uiSchemaData.definitions,
              categoryHash,
            })
          }
        >
          {/* @ts-expect-error children is part of the map*/}
          <Droppable droppableId="droppable" type={DROPPABLE_TYPE}>
            {(providedDroppable) => (
              <div ref={providedDroppable.innerRef} {...providedDroppable.droppableProps}>
                {generateElementComponentsFromSchemas({
                  schemaData,
                  uiSchemaData,
                  onChange: (newSchema, newUiSchema) =>
                    onChange(stringify(newSchema), stringify(newUiSchema)),
                  definitionData: schemaData.definitions,
                  definitionUi: uiSchemaData.definitions,
                  path: "root",
                  cardOpenArray,
                  setCardOpenArray,
                  allFormInputs,
                  mods,
                  categoryHash,
                  Card,
                  Section,
                }).map((element: any, index) => (
                  // @ts-ignore: suppress key error, can't change key assignment
                  <Draggable key={element.key} draggableId={element.key} index={index}>
                    {(providedDraggable) => (
                      <div
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.draggableProps}
                        {...providedDraggable.dragHandleProps}
                      >
                        {element}
                      </div>
                    )}
                  </Draggable>
                ))}
                {providedDroppable.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="form-footer formFooter">
        {!hideAddButton && mods?.components?.add && mods.components.add(addProperties)}
        {!mods?.components?.add && (
          <Add
            tooltipDescription={((mods || {}).tooltipDescriptions || {}).add}
            labels={mods?.labels ?? {}}
            addElem={(choice: string) => {
              if (choice === "card") {
                addCardObj(addProperties)
              } else if (choice === "section") {
                addSectionObj(addProperties)
              }
            }}
            hidden={hideAddButton}
          />
        )}
      </div>
    </div>
  )
}

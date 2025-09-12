import React, { ReactElement } from "react"
import { UncontrolledTooltip } from "reactstrap"
import FBCheckbox from "./checkbox/FBCheckbox"
import Collapse from "./Collapse/Collapse"
import CardModal from "./CardModal"
import CardGeneralParameterInputs from "./CardGeneralParameterInputs"
import Add from "./Add"
import Tooltip from "./Tooltip"
import { getRandomId } from "./utils"
import type { CardPropsType, CardComponentPropsType } from "./types"
import { ArrowsPointingOutIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"

export default function Card({
  componentProps,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  TypeSpecificParameters,
  addElem,
  cardOpen,
  setCardOpen,
  allFormInputs,
  mods,
  showObjectNameInput = true,
  addProperties,
}: CardPropsType): ReactElement {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [elementId] = React.useState(getRandomId())

  return (
    <React.Fragment>
      {/* @ts-expect-error children error */}
      <Collapse
        isOpen={cardOpen}
        toggleCollapse={() => setCardOpen(!cardOpen)}
        title={
          <div className="card-title-row">
            <span onClick={() => setCardOpen(!cardOpen)} className="label">
              {componentProps.title || componentProps.name}{" "}
              {componentProps.parent ? (
                <Tooltip
                  text={`Depends on ${componentProps.parent}`}
                  id={`${elementId}_parentinfo`}
                  type="alert"
                />
              ) : (
                ""
              )}
              {componentProps.$ref !== undefined ? (
                <Tooltip
                  text={`Is an instance of pre-configured component ${componentProps.$ref}`}
                  id={`${elementId}_refinfo`}
                  type="alert"
                />
              ) : (
                ""
              )}
            </span>
            <span className="move-icon" id={`${elementId}_moveformcard`}>
              <ArrowsPointingOutIcon
                className="w-8 h-8 stroke-2 stroke-secondary"
                onClick={() => {}}
              />
              <UncontrolledTooltip placement="top" target={`${elementId}_moveformcard`}>
                Drag to move form item
              </UncontrolledTooltip>
            </span>
          </div>
        }
        className={`card-container ${componentProps.dependent ? "card-dependent" : ""} ${
          componentProps.$ref === undefined ? "" : "card-reference"
        }`}
      >
        <div className="cardEntries">
          <CardGeneralParameterInputs
            parameters={componentProps}
            onChange={onChange}
            allFormInputs={allFormInputs}
            mods={mods}
            showObjectNameInput={showObjectNameInput}
          />
        </div>
        <div className="flex items-center justify-center gap-2 w-full mt-4">
          <span id={`${elementId}_editinfo`}>
            <PencilIcon className="w-8 h-8 stroke-secondary" onClick={() => setModalOpen(true)} />
          </span>
          <UncontrolledTooltip placement="top" target={`${elementId}_editinfo`}>
            Additional configurations for this item
          </UncontrolledTooltip>
          <span id={`${elementId}_trashinfo`}>
            <TrashIcon className="w-8 h-8 stroke-warning" onClick={() => onDelete && onDelete()} />
          </span>
          <UncontrolledTooltip placement="top" target={`${elementId}_trashinfo`}>
            Delete item
          </UncontrolledTooltip>
          <FBCheckbox
            onChangeValue={() =>
              onChange({
                ...componentProps,
                required: !componentProps.required,
              })
            }
            isChecked={!!componentProps.required}
            label="Required"
            id={`${elementId}_required`}
          />
        </div>
        <CardModal
          componentProps={componentProps as CardComponentPropsType}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onChange={(newComponentProps: CardComponentPropsType) => {
            onChange(newComponentProps)
          }}
          TypeSpecificParameters={TypeSpecificParameters}
        />
      </Collapse>
      {mods?.components?.add && mods?.components?.add(addProperties)}
      {!mods?.components?.add && addElem && (
        <Add
          tooltipDescription={((mods || {}).tooltipDescriptions || {}).add}
          addElem={(choice: string) => addElem(choice)}
        />
      )}
    </React.Fragment>
  )
}

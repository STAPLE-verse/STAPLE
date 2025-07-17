import React, { useState, useEffect } from "react"
import { Modal, ModalHeader, Button, ModalBody, ModalFooter, Input } from "reactstrap"
import DependencyField from "./dependencies/DependencyField"
import type { CardModalType, CardComponentPropsType } from "./types"
import Tooltip from "./Tooltip"

const CardModal: CardModalType = ({
  componentProps,
  onChange,
  isOpen,
  onClose,
  TypeSpecificParameters,
}) => {
  // assign state values for parameters that should only change on hitting "Save"
  const [componentPropsState, setComponentProps] = useState(componentProps)

  useEffect(() => {
    setComponentProps(componentProps)
  }, [componentProps])

  return (
    <Modal isOpen={isOpen} data-test="card-modal" className="cardModal">
      <ModalHeader className="card-modal-header">
        <div style={{ display: componentProps.hideKey ? "none" : "initial" }}>
          <div className="text-[18px] font-bold">Additional Settings</div>
        </div>
      </ModalHeader>
      <ModalBody className="card-modal-entries">
        <TypeSpecificParameters
          parameters={componentPropsState}
          onChange={(newState: CardComponentPropsType) => {
            setComponentProps({
              ...componentPropsState,
              ...newState,
            })
          }}
        />
        <div>
          <div className="text-[18px] font-bold">
            Column Size{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Tooltip
                id="column_size_tooltip"
                type="help"
                text="Set the column size of the item"
              />
            </a>
          </div>
          <Input
            value={componentPropsState["ui:column"] ? componentPropsState["ui:column"] : ""}
            placeholder="Column Size"
            key="ui:column"
            type="number"
            min={0}
            onChange={(ev) => {
              setComponentProps({
                ...componentPropsState,
                "ui:column": ev.target.value,
              })
            }}
            className="card-modal-text"
          />
        </div>
        <DependencyField
          parameters={componentPropsState}
          onChange={(newState) => {
            setComponentProps({
              ...componentPropsState,
              ...newState,
            })
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            onClose()
            onChange(componentPropsState)
          }}
          color="primary"
        >
          Save
        </Button>
        <Button
          onClick={() => {
            onClose()
            setComponentProps(componentProps)
          }}
          color="secondary"
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default CardModal

import React, { useState } from "react"
import type { CardComponentType } from "../types"
import { getRandomId } from "../utils"
import Tooltip from "../Tooltip"
import { Input } from "reactstrap"

export const PlaceholderInput: CardComponentType = ({ parameters, onChange }) => {
  const [elementId] = useState(getRandomId())
  return (
    <React.Fragment>
      <div className="text-[18px] font-bold">
        Placeholder{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Tooltip
            id={`${elementId}_placeholder`}
            type="help"
            text="Hint to the user as to what kind of information is expected in the field"
          />
        </a>
      </div>
      <Input
        value={parameters["ui:placeholder"] ? parameters["ui:placeholder"] : ""}
        placeholder="Placeholder"
        key="placeholder"
        type="text"
        onChange={(ev) => {
          onChange({
            ...parameters,
            "ui:placeholder": ev.target.value,
          })
        }}
        className="card-modal-text"
      />
    </React.Fragment>
  )
}

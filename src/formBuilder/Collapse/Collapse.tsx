import React, { FC, ReactNode, MouseEvent } from "react"
import { Collapse as RSCollapse } from "reactstrap"
import classnames from "classnames"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid"

interface CollapseProps {
  // Determines if the Collapse component is open
  isOpen: boolean
  // Toggles the isOpen boolean between true and false
  toggleCollapse: (event: MouseEvent<SVGSVGElement>) => void
  // The title to display in the collapse header
  title: ReactNode
  // Anything to be rendered within the collapse
  children: Array<ReactNode>
  // If true will gray out and disable */
  disableToggle?: boolean
  className?: string
}

const Collapse: FC<CollapseProps> = (props) => {
  const classes = classnames(`collapse-element ${props.className || ""} collapseElement`, {
    disabled: props.disableToggle,
  })

  return (
    <div className={classes}>
      <div className="flex">
        <span className="toggle-collapse">
          {props.isOpen ? (
            <ChevronDownIcon
              className="h-6 w-6 cursor-pointer stroke-secondary"
              onClick={(event) => {
                if (!props.disableToggle) {
                  props.toggleCollapse(event)
                }
              }}
            />
          ) : (
            <ChevronRightIcon
              className="h-6 w-6 cursor-pointer stroke-secondary"
              onClick={(event) => {
                if (!props.disableToggle) {
                  props.toggleCollapse(event)
                }
              }}
            />
          )}
        </span>
        <h4>{props.title}</h4>
      </div>
      <RSCollapse isOpen={props.isOpen}>
        <div>{props.children}</div>
      </RSCollapse>
    </div>
  )
}

export default Collapse

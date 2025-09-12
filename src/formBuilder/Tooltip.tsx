/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { ReactElement } from "react"
import { UncontrolledTooltip } from "reactstrap"

import { InformationCircleIcon, StarIcon } from "@heroicons/react/24/outline"

const typeMap = {
  alert: StarIcon,
  help: InformationCircleIcon,
}

export default function Example({
  text,
  type,
  id,
}: {
  text: string
  type: "alert" | "help"
  id: string
}): ReactElement {
  const Icon = typeMap[type]

  return (
    <React.Fragment>
      <span id={id}>
        <Icon className="h-4 w-4 inline stroke-2 stroke-info" />
      </span>
      <UncontrolledTooltip autohide={false} className="toolTip" placement="top" target={id}>
        {text}
      </UncontrolledTooltip>
    </React.Fragment>
  )
}

import React, { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

const handleStyle = { left: 10 }

const ElementNode = ({
  id,
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => (
  <div className="text-updater-node">
    <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
    <div className="bg-gray-300 px-3 py-3">
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <Link
        href={Routes.ShowElementPage({ projectId: data.projectId, elementId: id })}
        className="btn mt-2 text-sm"
        data-no-dnd="true"
      >
        Open
      </Link>
    </div>
    <Handle type="source" position={sourcePosition} isConnectable={isConnectable} />
  </div>
)

export default memo(ElementNode)

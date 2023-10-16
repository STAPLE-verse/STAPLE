import React, { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"

const handleStyle = { left: 10 }

const ElementNode = ({
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => (
  <div className="text-updater-node">
    <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
    <div>
      <h1>{data.title}</h1>
    </div>
    <Handle type="source" position={sourcePosition} isConnectable={isConnectable} />
  </div>
)

export default memo(ElementNode)

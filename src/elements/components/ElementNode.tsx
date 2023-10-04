import React, { useCallback, ReactNode } from "react"
import { Handle, Position } from "reactflow"

const handleStyle = { left: 10 }

interface ElementNodeProps {
  children: ReactNode
  isConnectable: boolean
}

const ElementNode: React.FC<ElementNodeProps> = ({ children, isConnectable }) => {
  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div>{children}</div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  )
}

export default ElementNode

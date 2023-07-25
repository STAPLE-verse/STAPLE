import React from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Task } from "@prisma/client"

interface TaskBoardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  tasks: Task[]
}

const TaskBoard = ({ tasks }: TaskBoardProps) => {}

export default TaskBoard

import React from "react"
import InputProps from "./input.type"

const TaskInput = ({ name, value, placeholder, onChange }: InputProps) => {
  return (
    <input
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="border p-2 w-full rounded-lg shadow-lg hover:shadow-xl"
    ></input>
  )
}

export default TaskInput

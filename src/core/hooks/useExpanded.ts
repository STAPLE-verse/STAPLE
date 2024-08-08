import { useState } from "react"

const useExpanded = (initialState = true) => {
  const [expanded, setExpanded] = useState(initialState)

  const toggleExpand = () => {
    setExpanded((prev) => !prev)
  }

  return { expanded, toggleExpand }
}

export default useExpanded

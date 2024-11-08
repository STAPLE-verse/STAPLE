import React, { createContext, useContext, useState, ReactNode } from "react"

// Define the shape of our context
interface MultiSelectContextType {
  selectedIds: number[]
  handleSelection: (selectedId: number) => void
  resetSelection: () => void
}

// Create the context
const MultiSelectContext = createContext<MultiSelectContextType | undefined>(undefined)

// Context provider component
export const MultiSelectProvider = ({ children }: { children: ReactNode }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const handleSelection = (selectedId: number) => {
    const isSelected = selectedIds.includes(selectedId)
    const newSelectedIds = isSelected
      ? selectedIds.filter((id) => id !== selectedId)
      : [...selectedIds, selectedId]

    setSelectedIds(newSelectedIds)
  }

  // Add resetSelection to clear all selected IDs
  const resetSelection = () => {
    setSelectedIds([])
  }

  // Provide the selectedIds and the handler to children components
  return (
    <MultiSelectContext.Provider value={{ selectedIds, handleSelection, resetSelection }}>
      {children}
    </MultiSelectContext.Provider>
  )
}

// Custom hook to use the context
export const useMultiSelect = () => {
  const context = useContext(MultiSelectContext)
  if (!context) {
    throw new Error("useMultiSelect must be used within a MultiSelectProvider")
  }
  return context
}

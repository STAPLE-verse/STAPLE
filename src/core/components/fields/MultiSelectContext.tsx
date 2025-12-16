import React, { createContext, useContext, useState, ReactNode } from "react"

// Define the shape of our context
interface MultiSelectContextType {
  selectedIds: number[]
  toggleSelection: (selectedId: number) => void
  resetSelection: () => void
  handleBulkSelection: (selectedIds: number[], isSelectAll: boolean) => void
  isGlobalSelection: boolean
  enableGlobalSelection: () => void
  disableGlobalSelection: () => void
}

// Create the context
const MultiSelectContext = createContext<MultiSelectContextType | undefined>(undefined)

// Context provider component
export const MultiSelectProvider = ({ children }: { children?: ReactNode }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isGlobalSelection, setIsGlobalSelection] = useState(false)

  // Toggle individual selection
  const toggleSelection = (selectedId: number) => {
    setIsGlobalSelection(false)
    setSelectedIds((prev) =>
      prev.includes(selectedId) ? prev.filter((item) => item !== selectedId) : [...prev, selectedId]
    )
  }

  // Handle bulk selection (select/deselect all)
  const handleBulkSelection = (selectedIds: number[], isSelectAll: boolean) => {
    setIsGlobalSelection(false)
    setSelectedIds((prev) => (isSelectAll ? [...new Set([...prev, ...selectedIds])] : []))
  }

  // Add resetSelection to clear all selected IDs
  const resetSelection = () => {
    setIsGlobalSelection(false)
    setSelectedIds([])
  }

  const enableGlobalSelection = () => {
    setIsGlobalSelection(true)
    setSelectedIds([])
  }

  const disableGlobalSelection = () => {
    setIsGlobalSelection(false)
  }

  // Provide the selectedIds and the handler to children components
  return (
    <MultiSelectContext.Provider
      value={{
        selectedIds,
        toggleSelection,
        resetSelection,
        handleBulkSelection,
        isGlobalSelection,
        enableGlobalSelection,
        disableGlobalSelection,
      }}
    >
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

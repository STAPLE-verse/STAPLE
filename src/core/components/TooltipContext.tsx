import { createContext, useContext } from "react"

const TooltipContext = createContext<{ enabled: boolean }>({ enabled: true })

export const useTooltipSetting = () => useContext(TooltipContext)

export const TooltipProvider = ({
  children,
  enabled,
}: {
  children: React.ReactNode
  enabled: boolean | undefined
}) => {
  return (
    <TooltipContext.Provider value={{ enabled: enabled ?? true }}>
      {children}
    </TooltipContext.Provider>
  )
}

export const useTooltip = () => {
  const { enabled } = useTooltipSetting()
  return { enabled }
}

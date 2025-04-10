import { createContext, useContext, useState } from "react"

type BreadcrumbCache = Record<string, string>

const BreadcrumbCacheContext = createContext<{
  names: BreadcrumbCache
  setName: (key: string, label: string) => void
}>({
  names: {},
  setName: () => {},
})

export const BreadcrumbCacheProvider = ({ children }: { children: React.ReactNode }) => {
  const [names, setNames] = useState<BreadcrumbCache>({})

  const setName = (key: string, label: string) => {
    setNames((prev) => (prev[key] ? prev : { ...prev, [key]: label }))
  }

  return (
    <BreadcrumbCacheContext.Provider value={{ names, setName }}>
      {children}
    </BreadcrumbCacheContext.Provider>
  )
}

export const useBreadcrumbCache = () => useContext(BreadcrumbCacheContext)

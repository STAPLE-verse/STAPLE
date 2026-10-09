import { useEffect, useLayoutEffect, useState } from "react"

const STORAGE_KEY = "sidebarExpanded"

// Each page renders its own Layout, so the sidebar is rebuilt on every page change. The choice
// is therefore kept outside the component: in memory (so moving between pages doesn't flicker)
// and in the browser (so it survives a reload).
let remembered: boolean | undefined

const readStored = (): boolean | undefined => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === null ? undefined : stored === "true"
  } catch {
    return undefined
  }
}

const store = (value: boolean) => {
  remembered = value
  try {
    window.localStorage.setItem(STORAGE_KEY, `${value}`)
  } catch {
    // storage unavailable (private mode, blocked): the in-memory copy still holds for this visit
  }
}

// useLayoutEffect warns during server rendering, where there is no storage to read anyway
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

const useExpanded = (initialState = true) => {
  const [expanded, setExpanded] = useState(remembered ?? initialState)

  // first load in this tab: pick up the choice saved by an earlier visit, before the first paint
  useIsomorphicLayoutEffect(() => {
    if (remembered === undefined) remembered = readStored()
    if (remembered !== undefined) setExpanded(remembered)
  }, [])

  const toggleExpand = () => {
    const next = !expanded
    store(next)
    setExpanded(next)
  }

  return { expanded, toggleExpand }
}

export default useExpanded

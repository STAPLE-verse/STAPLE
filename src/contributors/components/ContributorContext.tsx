import { useParam } from "@blitzjs/next"
import React, { createContext, useContext, useReducer, useEffect } from "react"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getContributor from "../queries/getContributor"
import { useQuery } from "@blitzjs/rpc"
import { Contributor } from "db"

// Define the types for the context state and dispatch
type ContributorState = {
  contributor: Contributor | null
  loading: boolean
  error: string | null
}

type ContributorAction =
  | { type: "SET_CONTRIBUTOR"; payload: Contributor | null }
  | { type: "LOADING" }
  | { type: "ERROR"; payload: string }
  | { type: "CLEAR_CONTRIBUTOR" }

type ContributorContextType = {
  state: ContributorState
  dispatch: React.Dispatch<ContributorAction>
}

const ContributorContext = createContext<ContributorContextType>({
  state: {
    contributor: null,
    loading: false,
    error: null,
  },
  dispatch: () => null,
})

const initialState: ContributorState = {
  contributor: null,
  loading: false,
  error: null,
}

const contributorReducer = (
  state: ContributorState,
  action: ContributorAction
): ContributorState => {
  switch (action.type) {
    case "SET_CONTRIBUTOR":
      return { ...state, contributor: action.payload, loading: false, error: null }
    case "LOADING":
      return { ...state, loading: true, error: null }
    case "ERROR":
      return { ...state, loading: false, error: action.payload }
    case "CLEAR_CONTRIBUTOR":
      return { ...state, contributor: null, loading: false, error: null }
    default:
      return state
  }
}

export const ContributorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contributorReducer, initialState)
  const user = useCurrentUser()
  const projectId = useParam("projectId", "number")

  const [contributor, { isLoading, isError, error }] = useQuery(
    getContributor,
    { where: { userId: user?.id, projectId: projectId } },
    { enabled: !!user && !!projectId } // Only run the query if user and projectId are available
  )

  useEffect(() => {
    if (isLoading) {
      dispatch({ type: "LOADING" })
    } else if (isError) {
      dispatch({ type: "ERROR", payload: (error as Error).message })
    } else if (contributor) {
      dispatch({ type: "SET_CONTRIBUTOR", payload: contributor })
    } else {
      dispatch({ type: "CLEAR_CONTRIBUTOR" })
    }
  }, [isLoading, isError, contributor, error])

  return (
    <ContributorContext.Provider value={{ state, dispatch }}>
      {children}
    </ContributorContext.Provider>
  )
}

export const useContributor = () => useContext(ContributorContext)

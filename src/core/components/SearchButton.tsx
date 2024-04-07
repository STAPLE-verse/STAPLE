import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getProjects from "src/projects/queries/getProjects"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { e } from "vitest/dist/index-9f5bc072"
import ProjectsList from "src/projects/components/ProjectsList"

type Props = {
  onChange?: (searchTerm: string) => void
}

const SearchButton = ({ onChange }: Props) => {
  const sidebarItems = HomeSidebarItems("Projects")

  const [searchTerm, setSearchTerm] = useState("")
  const [inputTextTerm, setInputTextTerm] = useState("")

  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0

  const handleSearch = () => {
    setSearchTerm(inputTextTerm)
    console.log("log before", searchTerm)
    if (onChange != undefined) {
      console.log("log after", searchTerm)
      onChange(searchTerm)
    }
  }

  const handleInputSearch = (event) => {
    setInputTextTerm(event.target.value)
  }

  return (
    <div>
      <div className="flex flex-row my-4 mx-auto w-full max-w-5xl   justify-between rounded-md shadow-sm">
        <input
          className="w-full h-10"
          type="search"
          placeholder=" Search project"
          value={inputTextTerm}
          onChange={handleInputSearch}
        ></input>
        <button
          className=""
          type="button"
          id="button-addon1"
          data-twe-ripple-init
          data-twe-ripple-color="light"
          onClick={handleSearch}
        >
          <span className="[&>svg]:h-5 [&>svg]:w-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}

export default SearchButton

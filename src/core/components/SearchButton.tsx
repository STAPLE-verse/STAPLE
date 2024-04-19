import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import React from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

type Props = {
  onChange?: (searchTerm: string) => void
  debounceTime?: number
}

const SearchButton = ({ onChange, debounceTime = 500 }: Props) => {
  const sidebarItems = HomeSidebarItems("Projects")

  const currentSearchTerm = ""
  const handleSearch = (value) => {
    if (onChange != undefined) {
      onChange(value)
    }
  }
  return (
    <div>
      <div
        className="flex flex-row  py-3 px-6 mx-auto w-full max-w-md items-center  justify-between relative text-gray-400 focus-within:text-gray-600
      bg-gray-50 border-b
      "
      >
        <MagnifyingGlassIcon className="w-5 h-5 absolute ml-3 pointer-events-none"></MagnifyingGlassIcon>

        <DebouncedInput
          type="search"
          debounce={debounceTime}
          value={currentSearchTerm}
          onChange={handleSearch}
          placeholder=" Search project"
          className="pr-3 pl-10 py-2 w-full h-10 w-full pr-3 pl-10  font-semibold placeholder-gray-500 text-black rounded-2xl border-none
          ring-2 ring-gray-300 focus:ring-gray-500 focus:ring-2"
        />
      </div>
    </div>
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}

export default SearchButton
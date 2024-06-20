import React from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

type Props = {
  onChange?: (searchTerm: string) => void
  debounceTime?: number
}

const SearchButton = ({ onChange, debounceTime = 500 }: Props) => {
  const currentSearchTerm = ""
  const handleSearch = (value) => {
    if (onChange != undefined) {
      onChange(value)
    }
  }
  return (
    <div>
      <div className="flex flex-row py-3 px-6 mx-auto w-full max-w-md items-center justify-between relative text-base-400 focus-within:text-base-600 bg-base-50">
        <MagnifyingGlassIcon className="w-5 h-5 absolute ml-3 pointer-events-none"></MagnifyingGlassIcon>

        <DebouncedInput
          type="search"
          debounce={debounceTime}
          value={currentSearchTerm}
          onChange={handleSearch}
          placeholder="Search Projects"
          className="bg-base-300 pr-3 pl-10 py-2 w-full h-10 w-full pr-3 pl-10 font-semibold placeholder-base-500 text-black rounded-2xl border-none ring-2 ring-base-300 focus:ring-base-500 focus:ring-2"
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setValue(initialValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const timeout = setTimeout(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      onChange(value)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, debounce)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}

export default SearchButton

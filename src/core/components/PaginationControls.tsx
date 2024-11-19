import React from "react"
import { useRouter } from "next/router"

interface PaginationControlsProps {
  page: number
  hasMore: boolean
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ page, hasMore }) => {
  const router = useRouter()

  const goToPreviousPage = async () => {
    if (page > 0) {
      await router.push({ query: { page: page - 1 } })
    }
  }

  const goToNextPage = async () => {
    if (hasMore) {
      await router.push({ query: { page: page + 1 } })
    }
  }

  return (
    <div className="join grid grid-cols-2 mt-4">
      <button
        className="join-item btn btn-secondary"
        disabled={page === 0}
        onClick={goToPreviousPage}
      >
        Previous
      </button>
      <button className="join-item btn btn-secondary" disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

export default PaginationControls

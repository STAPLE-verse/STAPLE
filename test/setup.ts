import "@testing-library/jest-dom"
import { vi } from "vitest"

// ---- Mock external email service (Resend) ----
vi.mock("resend", () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: "test-email-id" }),
    },
  })),
}))

// ---- Mock Blitz useQuery to prevent undefined data ----
vi.mock("@blitzjs/rpc", async () => {
  const actual = await vi.importActual<any>("@blitzjs/rpc")

  return {
    ...actual,
    useQuery: vi.fn(() => [
      {
        users: [],
        projectId: 1,
      },
      {},
    ]),
  }
})

// ---- Mock current user hook ----
vi.mock("src/users/hooks/useCurrentUser", () => ({
  useCurrentUser: () => ({
    id: 1,
    role: "ADMIN",
    email: "test@test.com",
  }),
}))

vi.mock("next/link", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => children,
  }
})

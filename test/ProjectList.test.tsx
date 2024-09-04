/**
 * @vitest-environment jsdom
 */

import { expect, vi, test } from "vitest"
import { render } from "test/utils"
import ProjectsList from "src/projects/components/ProjectsList"

import Home from "../src/pages/index"

vi.mock("public/logo.png", () => ({
  default: { src: "/logo.png" },
}))

test("renders project list", () => {
  vi.mock("src/users/hooks/useCurrentUser", () => ({
    useCurrentUser: () => ({
      id: 1,
      firstName: "User",
      lastName: "Family",
      email: "user@email.com",
      role: "user",
    }),
  }))

  const curentUser = {
    id: 1,
    firstName: "user1",
    lastName: "one",
    email: "d1@gmail.com",
    role: "USER",
    createdAt: "2024-08-16T10:30:32.042Z",
    username: "enguser",
    institution: null,
    language: "en-us",
  }

  render(<ProjectsList searchTerm={""} currentUser={curentUser} page={0}></ProjectsList>)

  // expect(await screen.findByText("1")).toBeInTheDocument();
  //   expect(await screen.findByText("2")).toBeInTheDocument();
  //   expect(await screen.findByText("3")).toBeInTheDocument();
})

/**
 * @vitest-environment jsdom
 */

import { expect, test, vi } from "vitest"
import { render, screen, within } from "test/utils"
import { InvitesListView } from "./InvitesList"

vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}))

const getInvites1 = () => {
  const d1: Date = new Date("2024-10-27 11:43 PM")
  const d2: Date = new Date("2024-12-27 12:03 AM")
  const invites = [
    {
      createdAt: d1,
      project: {
        name: "great paper",
      },
      invitationCode: "mui8z5k3kCIZfVKDGrrd",
      id: 1,
    },
    {
      createdAt: d2,
      project: {
        name: "managing app",
      },
      invitationCode: "6ILrT1TAhjFdRMGJh0gC",
      id: 2,
    },
  ]
  return invites
}

test("Render InvitesListView with two invites", async () => {
  const invites = getInvites1()
  render(<InvitesListView invites={invites}></InvitesListView>)

  const table = screen.getByRole("table")
  expect(screen.getByText(/date/i)).toBeInTheDocument()
  expect(screen.getByText(/project/i)).toBeInTheDocument()
  expect(screen.getByText(/invitation code/i)).toBeInTheDocument()
  expect(screen.getByText(/accept/i)).toBeInTheDocument()
  expect(screen.getByText(/decline/i)).toBeInTheDocument()

  expect(
    screen.queryByRole("cell", {
      name: /no data found/i,
    })
  ).not.toBeInTheDocument()

  expect(
    screen.getByRole("cell", {
      name: /october 27, 2024 at 23:43/i,
    })
  ).toBeInTheDocument()

  expect(
    screen.getByRole("cell", {
      name: /mui8z5k3kcizfvkdgrrd/i,
    })
  ).toBeInTheDocument()

  expect(
    screen.getByRole("cell", {
      name: /great paper/i,
    })
  ).toBeInTheDocument()

  expect(
    screen.getByRole("cell", {
      name: /october 27, 2024 at 23:43/i,
    })
  ).toBeInTheDocument()
  expect(
    screen.getByRole("cell", {
      name: /managing app/i,
    })
  ).toBeInTheDocument()

  expect(
    screen.getByRole("cell", {
      name: /6ilrt1tahjfdrmgjh0gc/i,
    })
  ).toBeInTheDocument()

  expect(
    screen.queryByRole("cell", {
      name: /march 27, 2024 at 23:43/i,
    })
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole("cell", {
      name: /my new app/i,
    })
  ).not.toBeInTheDocument()

  expect(
    screen.queryByRole("cell", {
      name: /12mnnnjfdrmgjh0gc/i,
    })
  ).not.toBeInTheDocument()

  const columnheaderDateSearch = screen.getByRole("columnheader", {
    name: /date/i,
  })
  expect(within(columnheaderDateSearch).getByRole("combobox")).toBeInTheDocument()
  const columnheaderProjectSearch = screen.getByRole("columnheader", {
    name: /project/i,
  })
  expect(within(columnheaderProjectSearch).getByRole("combobox")).toBeInTheDocument()

  const columnheaderCodeSearh = screen.getByRole("columnheader", {
    name: /invitation code/i,
  })

  expect(within(columnheaderCodeSearh).getByRole("combobox")).toBeInTheDocument()

  expect(table).toBeInTheDocument()
  const btns = within(table).queryAllByRole("button")
  expect(btns).not.toBeNull()
  expect(btns.length).equal(4)
})

test("Render InvitesListView with empty list", async () => {
  const invites = getInvites1()
  const { debug } = render(<InvitesListView invites={[]}></InvitesListView>)

  const table = screen.getByRole("table")
  expect(screen.getByText(/date/i)).toBeInTheDocument()
  expect(screen.getByText(/project/i)).toBeInTheDocument()
  expect(screen.getByText(/invitation code/i)).toBeInTheDocument()
  expect(screen.getByText(/accept/i)).toBeInTheDocument()
  expect(screen.getByText(/decline/i)).toBeInTheDocument()

  expect(
    screen.getByRole("cell", {
      name: /no data found/i,
    })
  ).toBeInTheDocument()

  expect(
    screen.queryByRole("cell", {
      name: /october 27, 2024 at 23:43/i,
    })
  ).not.toBeInTheDocument()

  expect(
    screen.queryByRole("cell", {
      name: /mui8z5k3kcizfvkdgrrd/i,
    })
  ).not.toBeInTheDocument()

  expect(
    screen.queryByRole("cell", {
      name: /great paper/i,
    })
  ).not.toBeInTheDocument()

  expect(table).toBeInTheDocument()
  const btns = within(table).queryAllByRole("button")
  expect(btns).not.toBeNull()
  expect(btns.length).equal(0)
})

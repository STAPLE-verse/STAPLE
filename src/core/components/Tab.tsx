import { PureComponent, ReactElement, SyntheticEvent, KeyboardEvent } from "react"

interface TabPanelProperties {
  onChange?: (tab: string) => void

  children: (tab: string) => ReactElement

  tabs: Readonly<string[]>

  id: string
}

export default class TabPanel extends PureComponent<TabPanelProperties> {
  state = { selectedTab: this.props.tabs[0] }

  get contentId() {
    return `${this.state.selectedTab}-content`
  }

  setSelectedTab = (selectedTab: string) => {
    this.setState({ selectedTab }, () => {
      const selector = `#${this.props.id} #${selectedTab}`
      ;(document.querySelector(selector) as HTMLButtonElement)?.focus()
      if (this.props.onChange) this.props.onChange(selectedTab)
    })
  }

  onTabChange = (event: SyntheticEvent) => {
    event.preventDefault()

    const tabId: string = (event.target as HTMLButtonElement).id

    this.setSelectedTab(tabId)
  }

  onArrowKeyChange = (event: KeyboardEvent<HTMLButtonElement>) => {
    const { tabs } = this.props
    const { selectedTab } = this.state

    const keys = ["ArrowLeft", "ArrowRight"]

    if (!keys.includes(event.key)) return

    const tabIndex = tabs.indexOf(selectedTab)

    const firstTab = tabs[0]
    const lastTab = tabs[tabs.length - 1]

    switch (event.key) {
      case keys[0]:
        this.setSelectedTab(selectedTab === firstTab ? lastTab : tabs[tabIndex - 1])
        break

      case keys[1]:
      default:
        this.setSelectedTab(selectedTab === lastTab ? firstTab : tabs[tabIndex + 1])
        break
    }
  }

  renderList = () => (
    <div className="tabs-list" role="tablist">
      {this.props.tabs.map((tab) => {
        const isSelectedTab = tab === this.state.selectedTab
        const className = `tab ${isSelectedTab ? "tab-selected" : ""}`

        return (
          <button
            id={tab}
            key={tab}
            type="button"
            role="tab"
            onClick={this.onTabChange}
            tabIndex={isSelectedTab ? 0 : -1}
            onKeyDown={this.onArrowKeyChange}
            className={className}
            aria-controls={this.contentId}
            aria-selected={isSelectedTab}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )

  renderPanel = () => (
    <div
      id={this.contentId}
      role="tabpanel"
      tabIndex={0}
      className="tabs-content"
      aria-labelledby={this.state.selectedTab}
    >
      {this.props.children(this.state.selectedTab)}
    </div>
  )

  render() {
    return (
      <div id={this.props.id} className="tabs">
        {this.renderList()}
        {this.renderPanel()}
      </div>
    )
  }
}

const ProjectDashboard = () => {
  return (
    <div className="flex flex-row justify-between">
      <div className="stats stats-vertical shadow">
        <div className="stat">
          <div className="stat-title">Contributors</div>
          <div className="stat-value">31</div>
          <div className="stat-desc">↗︎ 14 (22%)</div>
        </div>

        <div className="stat">
          <div className="stat-title">Contributions</div>
          <div className="stat-value">147</div>
          <div className="stat-desc">Jan 1st - Feb 1st</div>
        </div>

        <div className="stat">
          <div className="stat-title">Things to do</div>
          <div className="stat-value">120</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
      <div className="flex flex-col ml-2">
        <label className="badge mb-2 px-5 py-5 text-2xl">Progress</label>
        <div className="flex flex-col gap-2">
          {/* TODO: Ideally these will be rendered with map */}
          <progress className="progress w-56 h-4 mb-2" value={0} max="100"></progress>
          <progress className="progress w-56 h-4 mb-2" value="10" max="100"></progress>
          <progress className="progress w-56 h-4 mb-2" value="40" max="100"></progress>
          <progress className="progress w-56 h-4 mb-2" value="70" max="100"></progress>
          <progress className="progress w-56 h-4 mb-2" value="100" max="100"></progress>
        </div>
      </div>
      <div className="flex flex-col items-center ml-2">
        <label className="badge mb-2 px-5 py-5 text-2xl">Metadata coverage</label>
        <div className="radial-progress border-4 text-2xl" style={{ "--value": 70 }}>
          70%
        </div>
      </div>
    </div>
  )
}

export default ProjectDashboard

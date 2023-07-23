const ProjectDashboard = () => {
  return (
    <div className="flex flex-row">
      <div className="stats stats-vertical shadow">
        <div className="stat">
          <div className="stat-title">Downloads</div>
          <div className="stat-value">31K</div>
          <div className="stat-desc">Jan 1st - Feb 1st</div>
        </div>

        <div className="stat">
          <div className="stat-title">New Users</div>
          <div className="stat-value">4,200</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>

        <div className="stat">
          <div className="stat-title">New Registers</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
      <div className="flex flex-col ml-2">
        <progress className="progress w-56 mb-2" value={0} max="100"></progress>
        <progress className="progress w-56 mb-2" value="10" max="100"></progress>
        <progress className="progress w-56 mb-2" value="40" max="100"></progress>
        <progress className="progress w-56 mb-2" value="70" max="100"></progress>
        <progress className="progress w-56 mb-2" value="100" max="100"></progress>
      </div>
      <div className="ml-2">
        <div className="radial-progress" style={{ "--value": 90 }}>
          90%
        </div>
        <div className="radial-progress" style={{ "--value": 20 }}>
          20%
        </div>
      </div>
    </div>
  )
}

export default ProjectDashboard

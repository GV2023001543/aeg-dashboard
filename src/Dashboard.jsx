export default function Dashboard() {
  return (
    <div className="dashboard-grid">
      <div className="dashboard-main">
        <div className="top-metrics">
          <SummaryCards />
          <FinancialStats />
        </div>
        <ProjectTable />
      </div>

      <div className="dashboard-side">
        <ProjectStats />
        <RecentActivity />
      </div>
    </div>
  );
}

function SummaryCards() {
  const stats = [
    { title: 'Projects', value: '12/1' },
    { title: 'Key Account Managers', value: '14' },
    { title: 'Donors', value: '14' },
    { title: 'Team Members', value: '299' },
  ];

  return (
    <section className="summary-grid" aria-label="Summary">
      {stats.map((stat) => (
        <article key={stat.title} className="panel summary-card">
          <div className="summary-copy">
            <strong>{stat.value}</strong>
            <span>{stat.title}</span>
          </div>
          <div className="mini-bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </article>
      ))}
    </section>
  );
}

function ProjectTable() {
  const tableData = [
    { project: 'EDF', milestone: 'Milestone 1', desc: 'Capacity Building', start: '11-09-2020', end: '30-09-2021', priority: 'Overdue' },
    { project: '', milestone: 'Milestone 2', desc: 'Soil Health and Management', start: '11-09-2020', end: '30-09-2021', priority: 'Overdue' },
    { project: '', milestone: 'Milestone 3', desc: 'Crop Management', start: '11-09-2020', end: '30-09-2021', priority: 'Overdue' },
    { project: '', milestone: 'Milestone 4', desc: 'Farmers training and Advisory services', start: '11-09-2020', end: '30-09-2021', priority: 'Overdue' },
    { project: 'BMGF 10k Women AE program', milestone: 'Milestone 1', desc: 'AE certification', start: '01-01-2022', end: '31-12-2022', priority: 'Overdue' },
    { project: '', milestone: 'Milestone 2', desc: 'AE incubation and development', start: '01-01-2022', end: '31-12-2022', priority: 'Overdue' },
    { project: 'IFC', milestone: 'Milestone 1', desc: 'Milestone - 1', start: '01-11-2021', end: '21-08-2022', priority: 'Overdue' },
    { project: 'AE Sustainability project', milestone: 'Milestone 1', desc: 'Analysis of the current AE program', start: '03-04-2023', end: '05-05-2023', priority: 'Overdue' },
    { project: 'IFDC', milestone: 'Milestone 1', desc: 'Recruitment of Project Coordinators 3, Medak, Rangareddy and Mahbubnagar', start: '14-02-2022', end: '31-07-2022', priority: 'Overdue' },
    { project: '', milestone: 'Milestone 2', desc: '600 AFI Champions trained on entrepreneurship', start: '01-04-2022', end: '31-07-2022', priority: 'Overdue' },
    { project: '', milestone: 'Milestone 3', desc: '300 AFI Champions launch at least one business', start: '01-06-2022', end: '15-11-2022', priority: 'Overdue' },
  ];

  return (
    <section className="panel table-panel">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Milestone</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={`${row.milestone}-${index}`}>
                <td>{row.project}</td>
                <td>{row.milestone}</td>
                <td>{row.desc}</td>
                <td>{row.start}</td>
                <td>{row.end}</td>
                <td className="priority">{row.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FinancialStats() {
  return (
    <section className="panel financial-panel">
      <h2>Financial Stats</h2>
      <div className="financial-body">
        <div className="donut" aria-label="37 percent">
          <span>37%</span>
        </div>
        <div className="financial-list">
          <div>
            <span>Tasks Completed</span>
            <strong>108 / 148</strong>
          </div>
          <div>
            <span>Total Projects Value<br />(INR)</span>
            <strong className="money"><span>&#8377;</span>1,120,846,125</strong>
          </div>
          <div>
            <span>Accomplished Value<br />(INR)</span>
            <strong className="money"><span>&#8377;</span>17,141,002</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectStats() {
  const projects = [
    { name: 'AE SUSTAINABILITY PROJECT', progress: 78 },
    { name: 'AXIS BANK FOUNDATION', progress: 25 },
    { name: 'BMGF 10K WOMEN AE PROGRAM', progress: 2 },
    { name: "CERTIFIED SPRAYMEN'S IN YAWATMAL", progress: 78, tone: 'orange' },
    { name: 'CORTEVA-MP&UP', progress: 0 },
  ];

  return (
    <section className="panel project-stats">
      <h2>Project Stats</h2>
      <div className="progress-stack">
        {projects.map((project) => (
          <article key={project.name} className="progress-card">
            <div className="progress-title">
              <span>{project.name}</span>
              <span>{project.progress}%</span>
            </div>
            <div className="progress-track">
              <div
                className={project.tone === 'orange' ? 'progress-fill orange' : 'progress-fill'}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RecentActivity() {
  const activities = [
    ['AE Sustainability project', 'New milestone added in AE Sustainability project'],
    ['test', 'New milestone added in test'],
    ['FICCI-GiZ', 'New milestone added in FICCI-GiZ'],
    ['Google - Farmers outreach pilot', 'New milestone added in Google - Farmers outreach pilot'],
    ['EDF', 'New milestone added in EDF'],
    ['Axis Bank Foundation', 'New milestone added in Axis Bank Foundation'],
  ];

  return (
    <section className="panel activity-panel">
      <h2>Recent Activity</h2>
      <div className="activity-list">
        {activities.map(([title, text]) => (
          <article key={title} className="activity-item">
            <span className="activity-icon" aria-hidden="true" />
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

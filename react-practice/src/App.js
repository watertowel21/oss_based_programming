import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';

const API_ROOT = 'https://api.github.com';
const WINDOW_DAYS = 30;

const formatDuration = (hours) => {
  if (hours === null || hours === undefined) return '—';
  if (hours < 24) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
};

const average = (values) => values.length
  ? values.reduce((sum, value) => sum + value, 0) / values.length
  : null;

async function githubRequest(path, token) {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    const message = response.status === 403
      ? 'GitHub rate limit reached. Add a token and try again.'
      : `GitHub returned ${response.status}. Check the repository name.`;
    throw new Error(message);
  }
  return response.json();
}

export async function loadMetrics(repository, token = '') {
  const [repo, pullRequests, issues, commits, deployments] = await Promise.all([
    githubRequest(`/repos/${repository}`, token),
    githubRequest(`/repos/${repository}/pulls?state=all&sort=updated&direction=desc&per_page=100`, token),
    githubRequest(`/repos/${repository}/issues?state=all&sort=updated&direction=desc&per_page=100`, token),
    githubRequest(`/repos/${repository}/commits?per_page=100`, token),
    githubRequest(`/repos/${repository}/deployments?per_page=100`, token),
  ]);

  const since = Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const merged = pullRequests.filter((pull) => pull.merged_at && new Date(pull.merged_at).getTime() >= since);
  const closedIssues = issues.filter((issue) => !issue.pull_request && issue.closed_at);
  const recentDeployments = deployments.filter((deployment) => new Date(deployment.created_at).getTime() >= since);
  const leadTimes = merged.map((pull) => (new Date(pull.merged_at) - new Date(pull.created_at)) / 3600000);
  const issueCycleTimes = closedIssues
    .filter((issue) => new Date(issue.closed_at).getTime() >= since)
    .map((issue) => (new Date(issue.closed_at) - new Date(issue.created_at)) / 3600000);
  const recentCommits = commits.filter((commit) => new Date(commit.commit.author.date).getTime() >= since);
  const recentPulls = pullRequests.filter((pull) => new Date(pull.updated_at).getTime() >= since);
  const recentIssues = issues.filter((issue) => new Date(issue.updated_at).getTime() >= since && !issue.pull_request);

  return {
    repo,
    metrics: {
      leadTime: average(leadTimes),
      cycleTime: average(issueCycleTimes),
      deploymentFrequency: recentDeployments.length / WINDOW_DAYS,
      mergedPullRequests: merged.length,
      recentDeployments: recentDeployments.length,
      openIssues: issues.filter((issue) => issue.state === 'open' && !issue.pull_request).length,
      activity: [
        { label: 'Commits', value: recentCommits.length, color: '#7c5cff' },
        { label: 'Pull requests', value: recentPulls.length, color: '#16c79a' },
        { label: 'Issues', value: recentIssues.length, color: '#f4b740' },
        { label: 'Deployments', value: recentDeployments.length, color: '#ff6b81' },
      ],
    },
  };
}

function MetricCard({ label, value, detail, tone }) {
  return (
    <article className={`metric-card ${tone || ''}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}

function ActivityChart({ values }) {
  const max = Math.max(...values.map((item) => item.value), 1);
  return (
    <div className="activity-chart" aria-label="Repository activity for the last 30 days">
      {values.map((item) => (
        <div className="bar-row" key={item.label}>
          <span className="bar-label">{item.label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(item.value / max) * 100}%`, background: item.color }} />
          </div>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [repository, setRepository] = useState(process.env.REACT_APP_GITHUB_REPOSITORY || 'watertowel21/oss_based_programming');
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    const name = repository.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    if (!/^[\w.-]+\/[\w.-]+$/.test(name)) {
      setError('Enter a repository in the owner/name format.');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const result = await loadMetrics(name, process.env.REACT_APP_GITHUB_TOKEN);
      setData(result);
      setRepository(name);
      setLastUpdated(new Date());
      setStatus('success');
    } catch (requestError) {
      setError(requestError.message);
      setStatus('error');
    }
  }, [repository]);

  useEffect(() => { refresh(); }, [refresh]);

  const updatedLabel = useMemo(() => lastUpdated
    ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Not loaded yet', [lastUpdated]);

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">↗</div>
          <div><h1>Pulseboard</h1><span>Software delivery intelligence</span></div>
        </div>
        <div className="topbar-meta"><span className="live-dot" /> GitHub API <span className="separator">•</span> {updatedLabel}</div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">Team health overview</p>
          <h2>Ship with confidence.</h2>
          <p className="hero-copy">A clear view of your team&apos;s delivery flow, refreshed directly from GitHub.</p>
        </div>
        <form className="repo-form" onSubmit={(event) => { event.preventDefault(); refresh(); }}>
          <label htmlFor="repository">Repository</label>
          <div className="repo-input"><span>github.com/</span><input id="repository" value={repository} onChange={(event) => setRepository(event.target.value)} /></div>
          <button type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Loading…' : 'Refresh data'}</button>
        </form>
      </section>

      {status === 'error' && <div className="message error" role="alert">{error}</div>}
      {status === 'loading' && !data && <div className="message">Loading repository activity…</div>}
      {status !== 'loading' && !data && status !== 'error' && <div className="message">Enter a repository to get started.</div>}

      {data && (
        <>
          <section className="repo-summary">
            <img src={data.repo.owner.avatar_url} alt="" />
            <div><h3>{data.repo.full_name}</h3><p>{data.repo.description || 'No repository description provided.'}</p></div>
            <a href={data.repo.html_url} target="_blank" rel="noreferrer">View on GitHub ↗</a>
          </section>
          <section className="metric-grid">
            <MetricCard label="Lead time for changes" value={formatDuration(data.metrics.leadTime)} detail="PR opened → merged · 30 days" tone="purple" />
            <MetricCard label="Issue cycle time" value={formatDuration(data.metrics.cycleTime)} detail="Opened → closed · 30 days" tone="green" />
            <MetricCard label="Deployment frequency" value={`${data.metrics.deploymentFrequency.toFixed(2)}/day`} detail={`${data.metrics.recentDeployments} deployments · 30 days`} tone="yellow" />
            <MetricCard label="Open issues" value={data.metrics.openIssues} detail={`${data.metrics.mergedPullRequests} PRs merged · 30 days`} tone="pink" />
          </section>
          <section className="content-grid">
            <article className="panel activity-panel">
              <div className="panel-heading"><div><p className="eyebrow">Delivery signals</p><h3>Repository activity</h3></div><span className="period">Last 30 days</span></div>
              <ActivityChart values={data.metrics.activity} />
              <div className="chart-note"><span className="legend-dot" /> Activity is calculated from the latest 100 GitHub events per resource.</div>
            </article>
            <article className="panel decision-panel">
              <div className="panel-heading"><div><p className="eyebrow">Team decision support</p><h3>What to watch</h3></div></div>
              <div className="decision"><span className="decision-icon purple">↗</span><div><strong>Flow efficiency</strong><p>{data.metrics.leadTime === null ? 'Merge more pull requests to establish a lead-time baseline.' : 'Keep pull requests small to protect your lead-time baseline.'}</p></div></div>
              <div className="decision"><span className="decision-icon green">✓</span><div><strong>Delivery cadence</strong><p>{data.metrics.recentDeployments ? 'Deployments are being recorded for this repository.' : 'No deployments found. Connect your deployment workflow to track frequency.'}</p></div></div>
              <div className="decision"><span className="decision-icon yellow">!</span><div><strong>Backlog health</strong><p>{data.metrics.openIssues > 10 ? 'Open issues are high; consider a backlog refinement session.' : 'Open issue volume is within a manageable range.'}</p></div></div>
            </article>
          </section>
        </>
      )}
      <footer><span>Pulseboard</span> · GitHub-powered delivery metrics · Window: 30 days</footer>
    </main>
  );
}

export default App;

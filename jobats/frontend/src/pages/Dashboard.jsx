import React, { useEffect, useMemo, useState } from 'react';
import { getAnalysisHistory, getAdminStats, getProfile } from '../services/api';

const Dashboard = () => {
  const [email, setEmail] = useState(() => localStorage.getItem('lastEmail') || '');
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!email) return;
      setLoading(true);
      setError('');
      try {
        const [h, s, p] = await Promise.all([
          getAnalysisHistory(email),
          getAdminStats(),
          getProfile()
        ]);
        setHistory(h.data || []);
        setStats(s.data || null);
        setProfile(p.data || null);
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [email]);

  const scores = useMemo(() => history.map(r => r.atsScore).reverse(), [history]);

  const maxScore = 100;

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <h2>Profile Dashboard</h2>
          <p>Track your resume analysis progress and app stats</p>
        </div>

        <div className="card">
          <div className="input-group">
            <label htmlFor="dashboardEmail">Your email</label>
            <input
              id="dashboardEmail"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                localStorage.setItem('lastEmail', e.target.value);
              }}
              placeholder="your.email@example.com"
            />
          </div>
          {loading && <div className="loading-spinner" />}
          {error && <div className="alert alert-error">{error}</div>}
        </div>

        <div className="dashboard-grid">
          <div className="card">
            <h3 style={{ marginBottom: '10px' }}>Profile Completion</h3>
            {profile ? (
              (() => {
                const required = ['name', 'email', 'phone', 'city', 'state', 'country'];
                const optional = ['linkedin', 'github', 'skills', 'profilePhoto'];
                let filled = 0;
                required.forEach(k => { if (profile[k] && String(profile[k]).trim() !== '') filled++; });
                optional.forEach(k => { if (profile[k] && String(profile[k]).trim() !== '') filled++; });
                const total = required.length + optional.length;
                const pct = Math.round((filled / total) * 100);
                return (
                  <div>
                    <div style={{ height: '10px', background: 'var(--light)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '10px', background: 'var(--primary-color)' }} />
                    </div>
                    <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>{pct}% complete</p>
                    <a href="/profile" className="btn btn-secondary" style={{ marginTop: '8px' }}>Update Profile</a>
                  </div>
                );
              })()
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No profile data yet.</p>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '10px' }}>Resume Upload History</h3>
            {history.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No history yet. Upload your resume to get started.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '8px' }}>Date</th>
                    <th style={{ padding: '8px' }}>ATS Score</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((run, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '8px' }}>{new Date(run.createdAt).toLocaleString()}</td>
                      <td style={{ padding: '8px' }}>{run.atsScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '10px' }}>Progress Improvement Chart</h3>
            {scores.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No data yet.</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '160px', padding: '10px', background: 'var(--light)', borderRadius: '8px' }}>
                {scores.map((s, idx) => (
                  <div key={idx} style={{ width: '24px', height: `${(s / maxScore) * 140}px`, background: 'var(--primary-color)', borderRadius: '4px' }} title={`Score: ${s}`} />
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '10px' }}>App Stats</h3>
            {stats ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <div className="score-item">
                  <h4>Total Users</h4>
                  <div className="value">{stats.totalUsers}</div>
                </div>
                <div className="score-item">
                  <h4>Resumes Uploaded</h4>
                  <div className="value">{stats.resumesUploaded}</div>
                </div>
                <div className="score-item">
                  <h4>Latest Analyses</h4>
                  <div className="value">{stats.analysesLatest}</div>
                </div>
                <div className="score-item">
                  <h4>History Runs</h4>
                  <div className="value">{stats.analysesHistoryRuns}</div>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No stats available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

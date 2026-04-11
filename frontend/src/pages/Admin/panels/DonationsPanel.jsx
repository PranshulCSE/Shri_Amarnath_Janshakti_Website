import React, { useState, useEffect } from 'react';

export default function DonationsPanel({ api, onUpdate }) {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api(`/api/donations?page=${p}&limit=15`);
      const data = await res.json();
      setDonations(data.data || []);
      setTotal(data.pagination?.total || 0);
      setPages(data.pagination?.pages || 1);
      setPage(p);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to verify this donation?`)) return;

    try {
      const res = await api(`/api/donations/${id}/verify`, {
        method: 'PUT',
        body: JSON.stringify({ notes: '' })
      });

      if (!res.ok) throw new Error('Failed to verify donation');

      await load(page);

      // 🔥 THIS LINE (IMPORTANT)
      if (onUpdate) onUpdate();

    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="panel-loading" />;
  if (donations.length === 0) return <div className="panel-empty"><span>💰</span>No donation submissions yet</div>;

  return (
    <>
      <div className="panel-stat-grid" style={{ marginBottom: 16 }}>
        <div className="panel-stat-card">
          <span className="stat-icon">📈</span>
          <p className="stat-label">Total Donations</p>
          <h2 className="stat-number">{total}</h2>
        </div>
      </div>

      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Donor</th>
              <th>Contact Details</th>
              <th>Amount (₹)</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(d => {
              const status = d.status || 'pending';
              let badgeClass = 'badge-unread';
              if (status === 'verified') badgeClass = 'badge-active';
              if (status === 'rejected') badgeClass = 'badge-inactive';

              return (
                <React.Fragment key={d._id}>
                  <tr
                    style={{ cursor: 'pointer', background: expanded === d._id ? 'rgba(255,255,255,0.02)' : '' }}
                    onClick={() => setExpanded(expanded === d._id ? null : d._id)}
                  >
                    <td><span className={`badge ${badgeClass}`} style={{ textTransform: 'capitalize' }}>{status}</span></td>
                    <td><strong>{d.name}</strong></td>
                    <td>
                      <div>{d.phone}</div>
                    </td>
                    <td style={{ color: '#f5a623', fontWeight: 600, fontSize: '1.1rem' }}>₹{d.amount}</td>
                    <td>{new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {status === 'pending' && (
                          <>
                            <button className="panel-btn primary" onClick={(e) => { e.stopPropagation(); updateStatus(d._id, 'verified'); }} title="Verify Payment">
                              <i className="fas fa-check"></i>
                            </button>
                          </>
                        )}
                        <button className="panel-btn" onClick={(e) => { e.stopPropagation(); setExpanded(expanded === d._id ? null : d._id); }}>
                          {expanded === d._id ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === d._id && (
                    <tr>
                      <td colSpan={6} style={{ background: 'rgba(0,0,0,0.2)', padding: '24px' }}>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: '300px' }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#f5a623' }}>Donation Details</h4>
                            <div style={{
                              background: 'rgba(255,255,255,0.03)',
                              padding: '16px',
                              borderRadius: '12px',
                              border: '1px solid rgba(255,255,255,0.05)',
                              minHeight: '100px',
                            }}>
                              <div><strong>Transaction ID:</strong> {d.transactionId}</div>
                              <div><strong>Amount:</strong> ₹{d.amount}</div>
                              <div><strong>Status:</strong> {d.status}</div>
                              {d.verifiedAt && <div><strong>Verified At:</strong> {new Date(d.verifiedAt).toLocaleString()}</div>}
                              {d.notes && <div><strong>Notes:</strong> {d.notes}</div>}
                            </div>
                          </div>

                          <div style={{ width: '300px' }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#f5a623' }}>Payment Screenshot</h4>
                            {d.screenshot ? (
                              <a href={d.screenshot} target="_blank" rel="noreferrer" title="Click to view full size">
                                <img
                                  src={d.screenshot.startsWith('http') ? d.screenshot : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${d.screenshot}`}

                                  alt="Payment Screenshot"
                                  style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'block',
                                    transition: 'transform 0.2s ease',
                                    cursor: 'zoom-in'
                                  }}
                                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                />
                              </a>
                            ) : (
                              <div style={{
                                width: '100%',
                                height: '200px',
                                background: 'rgba(255,255,255,0.03)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '12px',
                                border: '1px dashed rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.3)'
                              }}>
                                No Screenshot
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '24px 0' }}>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} className={`panel-btn ${page === i + 1 ? 'primary' : ''}`} onClick={() => load(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

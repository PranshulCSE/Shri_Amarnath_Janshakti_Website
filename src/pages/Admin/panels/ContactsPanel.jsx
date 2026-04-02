import React, { useState, useEffect } from 'react';

export default function ContactsPanel({ api }) {
  const [contacts, setContacts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api(`/api/contacts?page=${p}&limit=15`);
      const data = await res.json();
      setContacts(data.contacts || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setPage(p);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await api(`/api/contacts/${id}/read`, { method: 'PATCH' });
    setContacts(prev => prev.map(c => c._id === id ? { ...c, isRead: true } : c));
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await api(`/api/contacts/${id}`, { method: 'DELETE' });
    load(page);
  };

  if (loading) return <div className="panel-loading" />;
  if (contacts.length === 0) return <div className="panel-empty"><span>📬</span>No contact messages yet</div>;

  return (
    <>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16, fontSize: '0.85rem' }}>
        Total: {total} messages
      </p>
      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <React.Fragment key={c._id}>
                <tr className={c.isRead ? '' : 'unread'} onClick={() => { setExpanded(expanded === c._id ? null : c._id); if (!c.isRead) markRead(c._id); }} style={{ cursor: 'pointer' }}>
                  <td><span className={`badge ${c.isRead ? 'badge-read' : 'badge-unread'}`}>{c.isRead ? 'Read' : 'New'}</span></td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.subject || '—'}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button className="panel-btn danger" onClick={(e) => { e.stopPropagation(); deleteContact(c._id); }}>Delete</button>
                  </td>
                </tr>
                {expanded === c._id && (
                  <tr>
                    <td colSpan={7} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px' }}>
                      <strong>Message:</strong><br />{c.message}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
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

import React, { useState, useEffect } from 'react';

export default function OverviewPanel({ api }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cRes, dRes, dpRes] = await Promise.all([
          api('/api/contacts?limit=1'),
          api('/api/donations?limit=1'),
          api('/api/donations/pending?limit=1'),
        ]);
        const contacts = await cRes.json();
        const donations = await dRes.json();
        const pendingDonations = await dpRes.json();

        setStats({
          totalContacts: contacts.total || 0,
          unreadContacts: contacts.unreadCount || 0,
          totalDonations: donations.pagination?.totalItems || donations.total || 0,
          unreadDonations: pendingDonations.pagination?.totalItems || pendingDonations.total || 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [api]);

  if (loading) return <div className="panel-loading" />;

  const StatCard = ({ icon, number, label, subtext }) => (
    <div className="panel-stat-card">
      <div className="stat-icon">{icon}</div>
      <p className="stat-number">{number}</p>
      <p className="stat-label">{label}</p>
      {subtext && <p className="stat-subtext">{subtext}</p>}
    </div>
  );

  return (
    <>
      {/* Stats Grid */}
      <div className="panel-stat-grid">
        <StatCard icon="📬" number={stats?.totalContacts} label="Contact Messages" />
        <StatCard icon="💌" number={stats?.unreadContacts} label="Unread Contacts" />
        <StatCard icon="💰" number={stats?.totalDonations} label="Donations" />
        <StatCard icon="⌛" number={stats?.unreadDonations} label="Pending Verifications" />
      </div>

      {/* Welcome Section */}
      <div className="panel-form">
        <h3>👋 Welcome to SAJSSM Admin Panel</h3>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.7 }}>
          Manage contact and donation submissions from this dashboard. Review new contact messages, verify donation payments, and track donation statistics. Use the sidebar to navigate between sections.
        </p>

        <div style={{ marginTop: 20, padding: 16, backgroundColor: 'rgba(245, 166, 35, 0.1)', borderRadius: 8, borderLeft: '3px solid #f5a623' }}>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
            <strong>✨ Tip:</strong> Check pending donations regularly to keep track of payment verifications.
          </p>
        </div>
      </div>
    </>
  );
}

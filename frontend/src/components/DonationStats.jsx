import React, { useEffect, useState } from 'react';
import { donationAPI } from '../../services/api';
import { COLORS, SPACING } from '../../constants/theme';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

/**
 * DonationStats Component
 * Displays donation statistics on dashboard
 */
const DonationStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await donationAPI.getStats();
                setStats(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: SPACING.lg, textAlign: 'center' }}>
                <p>Loading statistics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: SPACING.lg, textAlign: 'center', color: COLORS.error }}>
                <p>Error loading statistics: {error}</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: SPACING.md,
                marginBottom: SPACING.lg,
            }}
        >
            {/* Overall Stats Card */}
            <div
                style={{
                    background: COLORS.white,
                    padding: SPACING.lg,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    borderLeft: `4px solid ${COLORS.primary}`,
                }}
            >
                <h3 style={{ color: COLORS.textSecondary, fontSize: '12px', margin: '0 0 8px 0' }}>
                    Total Donations
                </h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.primary, margin: '0 0 8px 0' }}>
                    {stats.overall?.totalCount || 0}
                </p>
                <p style={{ color: COLORS.textSecondary, margin: 0 }}>
                    {formatCurrency(stats.overall?.totalAmount || 0)}
                </p>
            </div>

            {/* Verified Stats Card */}
            <div
                style={{
                    background: COLORS.white,
                    padding: SPACING.lg,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    borderLeft: `4px solid ${COLORS.success}`,
                }}
            >
                <h3 style={{ color: COLORS.textSecondary, fontSize: '12px', margin: '0 0 8px 0' }}>
                    Verified Donations
                </h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.success, margin: '0 0 8px 0' }}>
                    {stats.verified?.count || 0}
                </p>
                <p style={{ color: COLORS.textSecondary, margin: 0 }}>
                    {formatCurrency(stats.verified?.totalAmount || 0)}
                </p>
            </div>

            {/* Pending Stats Card */}
            <div
                style={{
                    background: COLORS.white,
                    padding: SPACING.lg,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    borderLeft: `4px solid ${COLORS.warning}`,
                }}
            >
                <h3 style={{ color: COLORS.textSecondary, fontSize: '12px', margin: '0 0 8px 0' }}>
                    Pending Verification
                </h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.warning, margin: '0 0 8px 0' }}>
                    {stats.pending?.count || 0}
                </p>
                <p style={{ color: COLORS.textSecondary, margin: 0 }}>
                    {formatCurrency(stats.pending?.totalAmount || 0)}
                </p>
            </div>

            {/* Average Amount Card */}
            <div
                style={{
                    background: COLORS.white,
                    padding: SPACING.lg,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    borderLeft: `4px solid ${COLORS.accent}`,
                }}
            >
                <h3 style={{ color: COLORS.textSecondary, fontSize: '12px', margin: '0 0 8px 0' }}>
                    Average Donation
                </h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.accent, margin: '0 0 8px 0' }}>
                    {stats.overall?.avgAmount ? formatCurrency(stats.overall.avgAmount) : '₹0'}
                </p>
                <p style={{ color: COLORS.textSecondary, margin: 0 }}>
                    Per donation
                </p>
            </div>
        </div>
    );
};

export default DonationStats;

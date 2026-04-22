import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    background: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '8px',
                    padding: '16px',
                    color: '#856404'
                }}>
                    <h2>⚠️ Something went wrong</h2>
                    <p>We encountered an error. Please refresh the page and try again.</p>
                    {process.env.NODE_ENV === 'development' && (
                        <details style={{ whiteSpace: 'pre-wrap', fontSize: '0.85em' }}>
                            {this.state.error?.toString()}
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

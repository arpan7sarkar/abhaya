import { Component } from 'react';
import { Shield, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#0f1117',
            color: '#f0f2f5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '400px',
              textAlign: 'center',
              background: 'rgba(15,17,23,0.88)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '40px 32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                background: 'rgba(239,68,68,0.15)',
                borderRadius: '16px',
                padding: '16px',
                display: 'inline-flex',
                marginBottom: '20px',
              }}
            >
              <Shield size={40} color="#ef4444" strokeWidth={2} />
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: '14px', color: '#8a8f9e', marginBottom: '24px', lineHeight: 1.5 }}>
              We&apos;re sorry, the app encountered an error. Please try again.
            </p>
            {this.state.error && (
              <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff8a8a', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '12px', textAlign: 'left', overflowX: 'auto' }}>
                <pre>{this.state.error.message}</pre>
                <pre style={{ marginTop: '8px', opacity: 0.7 }}>{this.state.error.stack}</pre>
              </div>
            )}
            <button
              type="button"
              onClick={this.handleRetry}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#e8c469',
                color: '#0f1117',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

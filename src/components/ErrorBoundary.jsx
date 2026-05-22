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
    console.error("ErrorBoundary caught an uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center" style={{ backgroundColor: 'var(--surface-0)', color: 'var(--text-primary)' }}>
          <div className="max-w-md w-full p-8 rounded-2xl border" style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-red-500/10 text-red-500">
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              An unexpected error occurred. You can try reloading the page, or return to the dashboard.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))', color: '#fff' }}
              >
                Reload Page
              </button>
              <button 
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }} 
                className="px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200"
                style={{ backgroundColor: 'var(--surface-3)', color: 'var(--text-secondary)' }}
              >
                Home
              </button>
            </div>
            {this.state.error && (
              <pre className="mt-6 p-4 rounded text-left text-xs overflow-auto max-h-40 font-mono bg-black/20 text-red-400">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

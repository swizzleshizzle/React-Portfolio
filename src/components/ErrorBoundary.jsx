import React from 'react';

// Generic React error boundary. Error boundaries must be class components -
// there is no hooks equivalent for getDerivedStateFromError/componentDidCatch.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: '#242424', color: '#cfdbe8' }}
        >
          Something went wrong.
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

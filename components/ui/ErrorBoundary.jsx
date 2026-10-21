'use client';

import { Component } from 'react';

// Catches render/runtime errors (e.g. a WebGL context failure) so that one broken widget
// never takes the whole page down. `fallback` is a function ({ error, reset }) => node.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (typeof console !== 'undefined') console.error('[ErrorBoundary]', error, info?.componentStack);
    if (this.props.onError) this.props.onError(error);
  }

  reset() {
    this.setState({ error: null });
    if (this.props.onReset) this.props.onReset();
  }

  render() {
    if (this.state.error) {
      const { fallback } = this.props;
      return typeof fallback === 'function' ? fallback({ error: this.state.error, reset: this.reset }) : fallback ?? null;
    }
    return this.props.children;
  }
}

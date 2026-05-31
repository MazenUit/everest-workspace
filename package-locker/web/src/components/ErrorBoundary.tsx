import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

// Catches render errors so one broken panel does not blank the whole demo.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Demo UI error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="mx-auto max-w-3xl p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <h1 className="text-lg font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm">{this.state.error.message}</p>
            <button
              type="button"
              className="mt-4 rounded-md bg-red-700 px-3 py-2 text-sm text-white hover:bg-red-800"
              onClick={() => this.setState({ error: null })}
            >
              Try again
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

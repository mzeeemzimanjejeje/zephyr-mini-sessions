import { Component, ErrorInfo, ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-5xl">⚠️</p>
          <h2 className="text-white font-bold text-xl">Something went wrong</h2>
          <p className="text-white/40 text-sm text-center max-w-sm">
            {this.state.error.message}
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

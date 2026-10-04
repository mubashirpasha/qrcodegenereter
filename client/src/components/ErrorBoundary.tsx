/** Production fallback: protects local work without exposing implementation details to end users. */
import { Home, RotateCcw, ScanLine, TriangleAlert } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false }; }

  static getDerivedStateFromError(): State { return { hasError: true }; }

  render() {
    if (this.state.hasError) {
      return <main className="recovery-page" role="alert"><section><span className="recovery-code">RECOVERY / 01</span><TriangleAlert size={34} /><h1>The studio needs a fresh start.</h1><p>Something interrupted this view. Reloading is safe; code generation and saved workspace items remain in your browser.</p><div className="recovery-actions"><button onClick={() => window.location.reload()} className="primary-cta"><RotateCcw size={16} />Reload page</button><a href="/" className="secondary-recovery"><Home size={16} />Go home</a><a href="/qr-generator" className="secondary-recovery"><ScanLine size={16} />Open QR studio</a></div></section></main>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

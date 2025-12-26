import React, { ReactNode } from "react";
import { logError } from "@/lib/errorLogger";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * Error Boundary Component
 * Catches React component errors and displays a user-friendly error UI.
 * Logs errors for debugging/observability.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(
      "React Error Boundary caught an error",
      {
        componentStack: errorInfo.componentStack,
      },
      error.stack
    );

    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <AlertDialogTitle>Something went wrong</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="space-y-4 pt-4">
                <p>
                  An unexpected error occurred. We've logged this for debugging.
                </p>
                {process.env.DEV && (
                  <details className="text-xs bg-muted p-2 rounded max-h-48 overflow-auto">
                    <summary className="cursor-pointer font-mono font-bold">
                      Error Details
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap break-words">
                      {this.state.error?.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-2">
              <AlertDialogCancel onClick={this.handleReset}>
                Try Again
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => (window.location.href = "/")}
                className="bg-primary hover:bg-primary/90"
              >
                Go Home
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    return this.props.children;
  }
}

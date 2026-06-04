import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function PageErrorBoundary({ children }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

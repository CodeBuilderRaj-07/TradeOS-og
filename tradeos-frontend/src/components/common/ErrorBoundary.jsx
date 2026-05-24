import React from "react";

import ErrorFallback
  from "./ErrorFallback";

export default class ErrorBoundary
  extends React.Component {

  constructor(props) {

    super(props);

    this.state = {

      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(
    error
  ) {

    return {

      hasError: true,
      error,
    };
  }

  componentDidCatch(
    error,
    errorInfo
  ) {

    console.error(
      "Application Error:",
      error,
      errorInfo
    );
  }

  resetErrorBoundary =
    () => {

      this.setState({

        hasError: false,
        error: null,
      });

      window.location.reload();
    };

  render() {

    if (
      this.state.hasError
    ) {

      return (

        <ErrorFallback

          error={
            this.state.error
          }

          resetErrorBoundary={
            this.resetErrorBoundary
          }
        />
      );
    }

    return this.props.children;
  }
}
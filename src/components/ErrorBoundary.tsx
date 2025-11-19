import React from "react"

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode
  fallback?: (props: { error: Error }) => React.ReactNode
}> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(_error: Error, _info: any) {
    // you can log the error here
    // console.error(_error, _info)
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback({ error: this.state.error })
      return <div className="p-8 text-red-500">Error: {String(this.state.error.message)}</div>
    }
    return this.props.children
  }
}

export default ErrorBoundary

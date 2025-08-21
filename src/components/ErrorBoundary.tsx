import { Button, Result } from 'antd'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

// React 19 호환 에러 바운더리
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // 개발 환경에서만 상세 에러 정보 표시
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="애플리케이션 오류"
          subTitle="죄송합니다. 예상치 못한 오류가 발생했습니다."
          extra={[
            <Button
              type="primary"
              key="reload"
              onClick={() => window.location.reload()}
            >
              페이지 새로고침
            </Button>,
            <Button key="home" onClick={() => (window.location.href = '/')}>
              홈으로 이동
            </Button>,
          ]}
        >
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <h4 className="text-red-800 font-semibold">개발자 정보:</h4>
              <pre className="text-red-700 text-sm mt-2 whitespace-pre-wrap">
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </div>
          )}
        </Result>
      )
    }

    return this.props.children
  }
}

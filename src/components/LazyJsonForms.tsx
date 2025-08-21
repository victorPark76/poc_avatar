import { Spin } from 'antd'
import { lazy, Suspense } from 'react'

// JSON Forms를 동적으로 로딩
const JsonForms = lazy(() =>
  import('@jsonforms/react').then(module => ({
    default: module.JsonForms,
  }))
)

interface LazyJsonFormsProps {
  schema: any
  uischema: any
  data: any
  onChange: (data: any) => void
  renderers?: any[]
}

export const LazyJsonForms = ({
  schema,
  uischema,
  data,
  onChange,
  renderers,
}: LazyJsonFormsProps) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-32">
          <Spin size="default" tip="폼 로딩 중..." />
        </div>
      }
    >
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        onChange={onChange}
        renderers={renderers || []}
      />
    </Suspense>
  )
}

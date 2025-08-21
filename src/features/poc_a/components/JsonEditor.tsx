import type { CharacterWithRank } from '@/utils/ranking'
import {
  CodeOutlined,
  FormOutlined,
  ReloadOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  ColorPicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
} from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

interface CharacterData {
  name: string
  gender: 'male' | 'female'
  type: 'A' | 'B' | 'C' | 'D'
  score: number
  face: string
  body: string
  rank?: number
}

type FormValues = Partial<CharacterData> & {
  face?: string | { toHexString(): string }
  body?: string | { toHexString(): string }
}

interface JsonEditorProps {
  initialData?: CharacterData
  onChange?: (data: CharacterWithRank) => void
  title?: string
  readOnly?: boolean
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  initialData,
  onChange,
  title = 'JSON Editor',
  readOnly = false,
}) => {
  const defaultInitialData: CharacterData = useMemo(
    () => ({
      name: '',
      gender: 'male',
      type: 'A',
      score: 50,
      face: '#000000',
      body: '#ffffff',
    }),
    []
  )

  const [data, setData] = useState<CharacterData>(
    initialData || defaultInitialData
  )
  const [rawJson, setRawJson] = useState(
    JSON.stringify(initialData || defaultInitialData, null, 2)
  )
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form')
  const [form] = Form.useForm()

  // 기본 데이터 구조 (캐릭터용)
  const defaultData: CharacterData = useMemo(
    () => ({
      ...defaultInitialData,
      ...initialData,
    }),
    [initialData, defaultInitialData]
  )

  // 초기 데이터 설정
  useEffect(() => {
    const initialFormValues = { ...initialData }
    if (initialFormValues.face && typeof initialFormValues.face === 'string') {
      initialFormValues.face = initialFormValues.face.startsWith('#')
        ? initialFormValues.face
        : `#${initialFormValues.face}`
    }
    if (initialFormValues.body && typeof initialFormValues.body === 'string') {
      initialFormValues.body = initialFormValues.body.startsWith('#')
        ? initialFormValues.body
        : `#${initialFormValues.body}`
    }
    form.setFieldsValue(initialFormValues)
  }, [initialData, form])

  const processFormValues = useCallback((values: FormValues) => {
    const processedValues = { ...values }
    if (processedValues.face && typeof processedValues.face === 'object') {
      processedValues.face = (
        processedValues.face as { toHexString(): string }
      ).toHexString()
    }
    if (processedValues.body && typeof processedValues.body === 'object') {
      processedValues.body = (
        processedValues.body as { toHexString(): string }
      ).toHexString()
    }
    return processedValues
  }, [])

  const updateData = useCallback(
    (processedValues: Partial<CharacterData>) => {
      const newData = { ...data, ...processedValues }
      setData(newData)
      setRawJson(JSON.stringify(newData, null, 2))
      setError(null)
      // rank 속성이 없는 경우 기본값 설정
      const dataWithRank: CharacterWithRank = {
        ...newData,
        rank: newData.rank || 0,
      }
      onChange?.(dataWithRank)
    },
    [data, onChange]
  )

  // Form 필드 변경 시 호출
  const handleFormChange = useCallback(
    (changedValues: FormValues, allValues: FormValues) => {
      // ColorPicker 변경일 경우에만 즉시 업데이트
      if (changedValues.face || changedValues.body) {
        const processedValues = processFormValues(allValues)
        updateData(processedValues)
      }
    },
    [processFormValues, updateData]
  )

  // Form 필드에서 blur 이벤트 발생 시 호출
  const handleFieldBlur = useCallback(() => {
    const values = form.getFieldsValue()
    const processedValues = processFormValues(values)
    updateData(processedValues)
  }, [form, processFormValues, updateData])

  // Form 제출 시 호출 (엔터 키 등)
  const handleFormFinish = useCallback(
    (values: FormValues) => {
      const processedValues = processFormValues(values)
      updateData(processedValues)
    },
    [processFormValues, updateData]
  )

  const handleRawJsonChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setRawJson(value)

      try {
        const parsed = JSON.parse(value)
        setData(parsed)
        setError(null)
        onChange?.(parsed)
      } catch {
        setError('Invalid JSON format')
      }
    },
    [onChange]
  )

  const handleReset = useCallback(() => {
    setData(defaultData)
    setRawJson(JSON.stringify(defaultData, null, 2))
    setError(null)
    form.setFieldsValue(defaultData)
    // rank 속성이 없는 경우 기본값 설정
    const dataWithRank: CharacterWithRank = {
      ...defaultData,
      rank: defaultData.rank || 0,
    }
    onChange?.(dataWithRank)
  }, [defaultData, form, onChange])

  const handleSave = useCallback(() => {
    try {
      const parsed = JSON.parse(rawJson)
      setData(parsed)
      setError(null)
      onChange?.(parsed)
    } catch {
      setError('Invalid JSON format')
    }
  }, [rawJson, onChange])

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key as 'form' | 'json')
  }, [])

  return (
    <Card>
      <div className="mb-4">
        <Title level={4}>{title}</Title>
      </div>

      <div className="mb-4">
        <Space>
          <Button
            type={activeTab === 'form' ? 'primary' : 'default'}
            icon={<FormOutlined />}
            onClick={() => handleTabChange('form')}
          >
            Form
          </Button>
          <Button
            type={activeTab === 'json' ? 'primary' : 'default'}
            icon={<CodeOutlined />}
            onClick={() => handleTabChange('json')}
          >
            JSON
          </Button>
        </Space>
      </div>

      {activeTab === 'form' ? (
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleFormChange}
          onFinish={handleFormFinish}
          disabled={readOnly}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Name" name="name">
                <Input
                  placeholder="Enter name"
                  onPressEnter={handleFieldBlur}
                  onBlur={handleFieldBlur}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Gender" name="gender">
                <Select placeholder="Select gender" onBlur={handleFieldBlur}>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Type" name="type">
                <Select placeholder="Select type" onBlur={handleFieldBlur}>
                  <Option value="A">Type A</Option>
                  <Option value="B">Type B</Option>
                  <Option value="C">Type C</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Score" name="score">
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="Enter score (0-100)"
                  style={{ width: '100%' }}
                  onPressEnter={handleFieldBlur}
                  onBlur={handleFieldBlur}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Face Color" name="face">
                <ColorPicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Body Color" name="body">
                <ColorPicker />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : (
        <div>
          <TextArea
            rows={10}
            value={rawJson}
            onChange={handleRawJsonChange}
            disabled={readOnly}
            placeholder="Enter JSON data"
          />
          {error && (
            <Alert message={error} type="error" showIcon className="mt-2" />
          )}
        </div>
      )}

      <Divider />

      <div className="flex justify-end space-x-2">
        <Button
          icon={<ReloadOutlined />}
          onClick={handleReset}
          disabled={readOnly}
        >
          Reset
        </Button>
        {activeTab === 'json' && (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            disabled={readOnly}
          >
            Save
          </Button>
        )}
      </div>
    </Card>
  )
}

export default JsonEditor

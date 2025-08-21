# React 19 개발 가이드 (Development Guide)

## 🚀 시작하기

### 필수 요구사항

- **Node.js**: 18.0.0 이상 (React 19 권장: 20.0.0+)
- **pnpm**: 8.0.0 이상
- **Git**: 최신 버전

### 개발 환경 설정

```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd poc_avatar

# 2. 의존성 설치
pnpm install

# 3. 개발 서버 실행
pnpm dev
```

### 주요 명령어

```bash
# 개발 서버 실행 (포트 3002)
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview

# 코드 포맷팅
pnpm format

# 린트 검사
pnpm lint

# 타입 체크
pnpm type-check
```

## 🆕 React 19 새로운 기능

### 자동 배치 (Automatic Batching)

```tsx
// React 19에서는 모든 상태 업데이트가 자동으로 배치됩니다
const handleClick = () => {
  setCount(c => c + 1) // 리렌더링 발생하지 않음
  setFlag(f => !f) // 리렌더링 발생하지 않음
  // 두 업데이트가 모두 완료된 후 한 번만 리렌더링
}
```

### 동시 기능 (Concurrent Features)

```tsx
import { startTransition, useTransition } from 'react'

// 우선순위가 낮은 업데이트를 startTransition으로 감싸기
const [isPending, startTransition] = useTransition()

const handleClick = () => {
  startTransition(() => {
    setSearchQuery(query) // 낮은 우선순위로 업데이트
  })
}
```

### 개선된 Suspense

```tsx
import { Suspense, lazy } from 'react'

// React 19의 향상된 Suspense
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>

// 중첩된 Suspense 지원
<Suspense fallback={<HeaderSkeleton />}>
  <Header />
  <Suspense fallback={<ContentSkeleton />}>
    <Content />
  </Suspense>
</Suspense>
```

### 새로운 훅들

```tsx
import { use, useOptimistic, useActionState } from 'react'

// use 훅으로 Promise 직접 사용
function UserProfile({ userPromise }) {
  const user = use(userPromise)
  return <h1>{user.name}</h1>
}

// useOptimistic으로 낙관적 업데이트
const [optimisticTodos, addOptimisticTodo] = useOptimistic(
  todos,
  (state, newTodo) => [...state, { ...newTodo, sending: true }]
)
```

## 🏗️ 프로젝트 구조 이해

### Feature-Based Architecture

이 프로젝트는 **Feature-Based Architecture**를 따릅니다. 각 기능은 독립적인 모듈로 구성되어 있어 유지보수성과 확장성을 높입니다.

```
src/features/
├── poc_a/              # 캐릭터 관리 시스템
│   ├── components/     # 기능별 UI 컴포넌트
│   ├── hooks/          # 기능별 커스텀 훅
│   ├── mock/           # 목 데이터 및 API
│   └── index.tsx       # 메인 진입점
├── poc_spine/          # 스파인 애니메이션 (예정)
└── bon/                # 뼈대 애니메이션 데모
```

### 컴포넌트 계층 구조

```
components/
├── atoms/              # 기본 UI 요소 (Button, Input 등)
├── molecules/          # 복합 컴포넌트 (SearchBar, Card 등)
├── organisms/          # 큰 단위 컴포넌트 (Header, Sidebar 등)
└── layout/             # 레이아웃 관련 컴포넌트
```

## 🎨 UI 컴포넌트 개발

### Ant Design 사용법

```tsx
import { Button, Card, Input } from 'antd'

// 기본 사용법
<Button type="primary" onClick={handleClick}>
  클릭하세요
</Button>

// 커스텀 스타일링
<Card className="custom-card">
  <Input placeholder="입력하세요" />
</Card>
```

### Tailwind CSS 클래스

```tsx
// 반응형 디자인
<div className="w-full md:w-1/2 lg:w-1/3">
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-bold text-gray-800">제목</h2>
  </div>
</div>
```

## 🔄 상태 관리

### Zustand 스토어 사용법

```tsx
// 스토어 정의
import { create } from 'zustand'

interface CharacterStore {
  characters: Character[]
  isLoading: boolean
  addCharacter: (character: Character) => void
}

export const useCharacterStore = create<CharacterStore>(set => ({
  characters: [],
  isLoading: false,
  addCharacter: character =>
    set(state => ({
      characters: [...state.characters, character],
    })),
}))

// 컴포넌트에서 사용
const { characters, addCharacter } = useCharacterStore()
```

### React Query 사용법

```tsx
import { useQuery, useMutation } from '@tanstack/react-query'

// 데이터 조회
const { data, isLoading, error } = useQuery({
  queryKey: ['characters'],
  queryFn: fetchCharacters,
})

// 데이터 수정
const mutation = useMutation({
  mutationFn: updateCharacter,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['characters'] })
  },
})
```

## 🎭 애니메이션 개발

### Three.js (3D 그래픽)

```tsx
import * as THREE from 'three'

// 기본 씬 설정
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()

// 구름 생성 예시
const createCloud = () => {
  const geometry = new THREE.SphereGeometry(1, 8, 6)
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
  return new THREE.Mesh(geometry, material)
}
```

### PixiJS (2D 그래픽)

```tsx
import * as PIXI from 'pixi.js'

// 애플리케이션 초기화
const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
})

// 스프라이트 생성
const sprite = PIXI.Sprite.from('image.png')
app.stage.addChild(sprite)
```

## 🧪 테스트 작성

### 컴포넌트 테스트

```tsx
import { render, screen } from '@testing-library/react'
import { CharacterManager } from './CharacterManager'

describe('CharacterManager', () => {
  it('캐릭터 목록을 렌더링한다', () => {
    render(<CharacterManager />)
    expect(screen.getByText('캐릭터 목록')).toBeInTheDocument()
  })
})
```

### 훅 테스트

```tsx
import { renderHook } from '@testing-library/react'
import { useCharacterData } from './useCharacterData'

describe('useCharacterData', () => {
  it('초기 상태를 반환한다', () => {
    const { result } = renderHook(() => useCharacterData())
    expect(result.current.isLoading).toBe(true)
  })
})
```

## 📝 코드 컨벤션

### TypeScript 규칙

```tsx
// 인터페이스 정의
interface Character {
  id: string
  name: string
  level: number
  createdAt: Date
}

// 타입 가드 사용
const isCharacter = (obj: unknown): obj is Character => {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj
}
```

### React 19 컴포넌트 규칙

```tsx
// 함수형 컴포넌트
const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onEdit,
  onDelete,
}) => {
  // 훅은 최상단에 배치
  const [isEditing, setIsEditing] = useState(false)

  // 이벤트 핸들러 - React 19의 자동 배치 활용
  const handleEdit = useCallback(() => {
    setIsEditing(true)
    onEdit?.(character)
  }, [character, onEdit])

  // React 19의 새로운 훅 활용
  const [optimisticCharacter, addOptimisticCharacter] = useOptimistic(
    character,
    (state, newData) => ({ ...state, ...newData })
  )

  return <Card className="character-card">{/* JSX 내용 */}</Card>
}
```

## 🔧 디버깅 및 개발 도구

### VS Code 설정

`.vscode/settings.json`에 다음 설정을 추가하세요:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 필수 VS Code 확장 프로그램

- **Prettier**: 코드 포맷팅
- **ESLint**: 코드 품질 검사
- **Tailwind CSS IntelliSense**: Tailwind 클래스 자동완성
- **TypeScript Importer**: 타입 자동 임포트

### 브라우저 개발자 도구

- **React Developer Tools**: React 19 컴포넌트 디버깅
- **Redux DevTools**: 상태 관리 디버깅 (Zustand 지원)
- **Three.js Inspector**: 3D 씬 디버깅

## 🚀 React 19 성능 최적화

### 자동 최적화 활용

```tsx
// React 19의 자동 배치 활용
const handleMultipleUpdates = () => {
  // 이제 자동으로 배치됩니다
  setCount(c => c + 1)
  setFlag(f => !f)
  setText('updated')
}

// 동시 기능 활용
const [isPending, startTransition] = useTransition()

const handleSearch = (query: string) => {
  setSearchQuery(query) // 즉시 업데이트

  startTransition(() => {
    setSearchResults([]) // 낮은 우선순위
    performSearch(query) // 낮은 우선순위
  })
}
```

### 새로운 훅 활용

```tsx
// use 훅으로 데이터 페칭
function UserProfile({ userId }: { userId: string }) {
  const user = use(fetchUser(userId))
  return <div>{user.name}</div>
}

// useOptimistic으로 사용자 경험 개선
const [optimisticTodos, addOptimisticTodo] = useOptimistic(
  todos,
  (state, newTodo) => [...state, { ...newTodo, sending: true }]
)

const handleAddTodo = async (text: string) => {
  addOptimisticTodo({ id: Date.now(), text, completed: false })
  await addTodo(text)
}
```

### 번들 최적화

```tsx
// 동적 임포트
const LazyComponent = React.lazy(() => import('./LazyComponent'))

// 코드 스플리팅
const routes = [
  {
    path: '/poc_a',
    component: React.lazy(() => import('@/features/poc_a')),
  },
]
```

## 📚 유용한 리소스

### 공식 문서

- [React 19 문서](https://react.dev/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Ant Design 문서](https://ant.design/docs/react/introduce)

### 학습 자료

- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://github.com/pmndrs/zustand)
- [Three.js 문서](https://threejs.org/docs/)
- [PixiJS 문서](https://pixijs.io/docs/)

### React 19 관련 자료

- [React 19 릴리즈 노트](https://react.dev/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024)
- [React 19 마이그레이션 가이드](https://react.dev/learn/upgrading)
- [React 19 새로운 기능](https://react.dev/learn/start-a-new-react-project)

---

이 가이드를 통해 React 19의 새로운 기능들을 활용하여 프로젝트에 빠르게 적응하고 효율적으로 개발할 수 있습니다. 질문이나 개선사항이 있으면 언제든지 문의해주세요!

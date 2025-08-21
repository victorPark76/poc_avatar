# 🎯 AI 어시스턴트용 React 19 프로젝트 가이드

> **이 문서는 AI 어시스턴트가 React 19 프로젝트를 이해하고 효율적으로 도움을 드리기 위한 핵심 정보를 담고 있습니다.**

## 🚀 프로젝트 핵심 정보

### **프로젝트명**: POC Avatar

### **목적**: 아바타/캐릭터 시스템을 위한 Proof of Concept 애플리케이션

### **현재 상태**: React 19로 업그레이드 완료, 개발 중 (기본 구조 완성, 기능 구현 진행 중)

---

## 🏗️ 기술 스택 (AI가 알아야 할 핵심)

### **Frontend**

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** (스타일링)
- **Ant Design** (UI 컴포넌트)

### **React 19 새로운 기능**

- **자동 배치 (Automatic Batching)**: 성능 최적화
- **동시 기능 (Concurrent Features)**: 사용자 경험 향상
- **개선된 Suspense**: 더 나은 로딩 상태 관리
- **새로운 훅들**: `use`, `useOptimistic`, `useActionState` 등

### **상태 관리**

- **Zustand** (전역 상태)
- **React Query** (서버 상태, 캐싱)

### **그래픽 & 애니메이션**

- **Three.js** (3D 구름 배경)
- **PixiJS** (2D 뼈대 애니메이션)

### **패키지 매니저**: `pnpm`

---

## 📁 핵심 파일 구조 (AI가 자주 참조할 것들)

```
src/
├── App.tsx                    # 메인 앱 (React 19 최적화, Suspense 포함)
├── main.tsx                   # React 19 렌더링 진입점
├── routes/index.tsx           # 라우팅 정의
├── features/                  # ⭐ 핵심 기능들
│   ├── poc_a/                # 캐릭터 관리 시스템
│   │   ├── index.tsx         # 메인 진입점
│   │   ├── components/       # UI 컴포넌트들
│   │   └── hooks/            # 커스텀 훅들 (React 19 최적화)
│   └── bon/                  # 뼈대 애니메이션 데모
├── stores/                    # Zustand 스토어들
│   ├── characterStore.ts     # 캐릭터 상태 관리
│   └── screenSizeStore.ts    # 화면 크기 상태
├── services/                  # API 서비스
│   └── characterService.ts    # 캐릭터 데이터 관리
└── hooks/                     # 공통 커스텀 훅 (React 19)
    ├── useTransition.ts       # 동시 기능 훅
    └── useOptimistic.ts      # 낙관적 업데이트 훅
```

---

## 🎭 주요 기능 (AI가 이해해야 할 것들)

### **1. POC A - 캐릭터 관리 시스템** ⭐

- **위치**: `/poc_a` 경로
- **핵심 컴포넌트**: `CharacterManager`, `CloudScene`, `JsonEditor`
- **기능**: 캐릭터 CRUD, 3D 구름 배경, JSON 편집
- **상태**: Zustand + React Query로 관리
- **React 19**: Suspense와 동시 기능 활용

### **2. BON - 뼈대 애니메이션** ⭐

- **위치**: `/bon` 경로
- **기술**: PixiJS로 구현된 2D 애니메이션
- **기능**: 걷기 애니메이션, 벡터 그래픽 캐릭터
- **React 19**: 자동 배치로 성능 최적화

### **3. 공통 기능**

- 반응형 디자인 (Tailwind CSS)
- 전역 상태 관리 (Zustand)
- 라우팅 (React Router)
- React 19의 새로운 기능들 활용

---

## 🔄 데이터 플로우 (AI가 알아야 할 핵심 로직)

### **캐릭터 데이터 흐름**

```
1. Mock API → 2. React Query → 3. Zustand Store → 4. UI Components
```

### **React 19 최적화된 스토어 구조**

```typescript
// characterStore.ts
{
  characters: Character[],        // 캐릭터 목록
  selectedCharacter: Character,   // 선택된 캐릭터
  isLoading: boolean,            // 로딩 상태
  error: string | null,          // 에러 상태
  // React 19: 자동 배치로 상태 업데이트 최적화
}
```

### **React 19 새로운 훅 활용**

```typescript
// useOptimistic으로 낙관적 업데이트
const [optimisticCharacters, addOptimisticCharacter] = useOptimistic(
  characters,
  (state, newCharacter) => [...state, { ...newCharacter, sending: true }]
)

// useTransition으로 동시 기능 활용
const [isPending, startTransition] = useTransition()
```

---

## 🎨 UI 컴포넌트 패턴 (AI가 따라야 할 것들)

### **컴포넌트 구조**

- **Atoms**: `Button`, `Card` (기본 UI 요소)
- **Molecules**: 복합 컴포넌트
- **Organisms**: 큰 단위 컴포넌트
- **Layout**: `Header` 등 레이아웃 관련

### **React 19 컴포넌트 패턴**

```tsx
// Suspense를 활용한 로딩 상태 관리
;<Suspense fallback={<LoadingSpinner />}>
  <CharacterManager />
</Suspense>

// 동시 기능을 활용한 사용자 경험 개선
const handleSearch = (query: string) => {
  setSearchQuery(query) // 즉시 업데이트

  startTransition(() => {
    setSearchResults([]) // 낮은 우선순위
    performSearch(query) // 낮은 우선순위
  })
}
```

### **스타일링 규칙**

- **Tailwind CSS** 클래스 사용
- **Ant Design** 컴포넌트 활용
- 반응형 디자인 (`md:`, `lg:` 접두사)

---

## 🚧 현재 개발 상태 (AI가 알아야 할 것들)

### **✅ 완료된 것들**

- React 19 업그레이드 완료
- 기본 프로젝트 구조
- POC A 캐릭터 관리 시스템
- BON 뼈대 애니메이션
- 상태 관리 시스템

### **🚧 진행 중인 것들**

- React 19 새로운 기능 활용
- 캐릭터 애니메이션 시스템 개선
- 성능 최적화

### **📋 계획된 것들**

- POC Spine 애니메이션 시스템
- 캐릭터 커스터마이징 도구
- React 19 동시 기능 활용

---

## 🔧 개발 환경 (AI가 제안할 수 있는 것들)

### **명령어**

```bash
pnpm dev      # 개발 서버 (포트 3002)
pnpm build    # 프로덕션 빌드
pnpm lint     # 코드 검사
pnpm format   # 코드 포맷팅
```

### **React 19 개발 도구**

- **React Developer Tools**: React 19 컴포넌트 디버깅
- **Vite**: React 19 최적화된 빌드 도구
- **TypeScript**: React 19 타입 지원

### **VS Code 확장 프로그램**

- Prettier, ESLint
- Tailwind CSS IntelliSense
- TypeScript Importer

---

## 🎯 AI 어시스턴트가 주로 도와줄 것들

### **1. React 19 코드 작성 & 수정**

- React 19 컴포넌트 개발
- 새로운 훅 활용 (`use`, `useOptimistic` 등)
- 동시 기능 구현
- Suspense 최적화

### **2. 기능 구현**

- 새로운 UI 컴포넌트
- 애니메이션 시스템
- 데이터 관리 로직
- API 연동

### **3. 문제 해결**

- 버그 수정
- React 19 성능 최적화
- 코드 리팩토링
- 에러 디버깅

### **4. 아키텍처 개선**

- React 19 아키텍처 활용
- 코드 구조 개선
- 상태 관리 최적화
- 컴포넌트 설계
- 타입 시스템 강화

---

## 📚 AI가 참조해야 할 추가 문서들

1. **`DEVELOPMENT_GUIDE.md`** - React 19 개발 가이드
2. **`API_DOCS.md`** - API 및 서비스 구조
3. **`FILE_NAMING_CONVENTIONS.md`** - React 19 파일명 규칙

---

## ⚠️ AI가 주의해야 할 것들

### **React 19 기술적 제약사항**

- **React 19** 사용 (최신 기능 활용)
- **TypeScript** 엄격 모드
- **pnpm** 패키지 매니저 사용
- **Tailwind CSS** 우선 사용

### **React 19 아키텍처 원칙**

- **Feature-based** 구조 유지
- **Atomic Design** 컴포넌트 패턴
- **Zustand** + **React Query** 조합
- **React 19 새로운 훅** 활용
- **동시 기능** 활용한 사용자 경험 개선

### **코드 품질**

- **ESLint** 규칙 준수
- **Prettier** 포맷팅 적용
- **TypeScript** 타입 안전성
- **반응형 디자인** 고려
- **React 19 성능 최적화** 적용

---

## 🆕 React 19 특별 가이드라인

### **새로운 훅 활용**

```tsx
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

### **동시 기능 활용**

```tsx
// startTransition으로 우선순위 조절
const [isPending, startTransition] = useTransition()

const handleClick = () => {
  startTransition(() => {
    setSearchQuery(query) // 낮은 우선순위
  })
}
```

### **Suspense 최적화**

```tsx
// 중첩된 Suspense 지원
<Suspense fallback={<HeaderSkeleton />}>
  <Header />
  <Suspense fallback={<ContentSkeleton />}>
    <Content />
  </Suspense>
</Suspense>
```

---

## 🎯 AI 어시스턴트 행동 지침

1. **React 19 프로젝트 구조를 먼저 파악**하고 답변
2. **React 19 새로운 기능을 활용**한 코드 작성
3. **기존 패턴을 따라** 코드 작성
4. **TypeScript 타입**을 명시적으로 정의
5. **Tailwind CSS**를 활용한 스타일링 제안
6. **React 19 성능과 확장성**을 고려한 해결책 제시
7. **기존 코드와의 일관성** 유지
8. **동시 기능과 Suspense**를 활용한 사용자 경험 개선

---

> **이 문서는 AI 어시스턴트가 React 19 프로젝트를 빠르게 이해하고 효율적으로 도움을 드리기 위한 것입니다.**
> **React 19의 새로운 기능들을 최대한 활용하여 프로젝트가 발전함에 따라 지속적으로 업데이트됩니다.**

# React 19 파일명 규칙 (File Naming Conventions)

## 📋 개요

이 문서는 POC Avatar 프로젝트에서 사용되는 파일명 규칙과 네이밍 컨벤션을 정의합니다. React 19의 새로운 기능들을 고려하여 일관된 파일명 규칙을 통해 코드의 가독성과 유지보수성을 향상시킵니다.

## 🆕 React 19 새로운 파일 구조

### **React 19 최적화된 구조**

```
src/
├── components/          # 공통 컴포넌트
├── features/            # 기능별 모듈
├── services/            # API 서비스
├── stores/              # 상태 관리 (Zustand)
├── utils/               # 유틸리티 함수
├── creators/            # 생성자 함수
├── pages/               # 페이지 컴포넌트
├── routes/              # 라우팅 설정
├── assets/              # 정적 자산
└── hooks/               # 커스텀 훅 (React 19 최적화)
```

## 🏗️ 디렉토리 구조 규칙

### 1. **기본 디렉토리**

```
src/
├── components/          # 공통 컴포넌트
├── features/            # 기능별 모듈
├── services/            # API 서비스
├── stores/              # 상태 관리
├── utils/               # 유틸리티 함수
├── creators/            # 생성자 함수
├── pages/               # 페이지 컴포넌트
├── routes/              # 라우팅 설정
└── assets/              # 정적 자산
```

### 2. **Feature 디렉토리**

```
src/features/
├── poc_a/               # POC A 기능 (캐릭터 관리)
├── poc_spine/           # POC Spine 기능 (예정)
└── bon/                 # BON 기능 (뼈대 애니메이션)
```

### 3. **컴포넌트 계층 구조**

```
src/components/
├── atoms/               # 기본 UI 요소
├── molecules/           # 복합 컴포넌트
├── organisms/           # 큰 단위 컴포넌트
├── layout/              # 레이아웃 컴포넌트
└── common/              # 공통 컴포넌트
```

## 📁 파일명 규칙

### 1. **React 19 컴포넌트 파일**

#### **PascalCase 사용**

```typescript
// ✅ 올바른 예시
CharacterManager.tsx
JsonEditor.tsx
CloudScene.tsx
Header.tsx
Logo.tsx
Button.tsx
Card.tsx

// ❌ 잘못된 예시
characterManager.tsx
json - editor.tsx
cloud_scene.tsx
```

#### **React 19 컴포넌트 디렉토리 구조**

```
ComponentName/
├── ComponentName.tsx    # 메인 컴포넌트
├── index.ts             # 내보내기 파일
├── ComponentName.module.css  # 스타일 (필요시)
└── useComponentName.ts  # 커스텀 훅 (React 19 최적화)
```

**예시:**

```
CharacterManager/
├── CharacterManager.tsx
├── index.ts
└── useCharacterManager.ts

CloudScene/
├── index.tsx            # 단일 파일인 경우
```

### 2. **TypeScript 파일**

#### **camelCase 사용**

```typescript
// ✅ 올바른 예시
characterService.ts
characterStore.ts
screenSizeStore.ts
animation.ts
ranking.ts
cloudCreator.ts
characterCreator.ts
backgroundCreator.ts

// ❌ 잘못된 예시
CharacterService.ts
character - store.ts
animation_utils.ts
```

#### **React 19 파일 타입별 접미사**

```typescript
// 서비스 파일
*Service.ts              // characterService.ts

// 스토어 파일 (Zustand)
*Store.ts                // characterStore.ts

// 유틸리티 파일
*.ts                     // animation.ts, ranking.ts

// 생성자 파일
*Creator.ts              // cloudCreator.ts, characterCreator.ts

// React 19 커스텀 훅
use*.ts                  // useCharacterData.ts, useOptimisticUpdate.ts

// 타입 정의 파일
*.d.ts                   // vite-env.d.ts
```

### 3. **React 19 관련 파일**

#### **메인 진입점**

```typescript
// ✅ 올바른 예시
main.tsx                 # 애플리케이션 진입점 (React 19 렌더링)
App.tsx                  # 메인 앱 컴포넌트 (React 19 최적화)
index.tsx                # 페이지/기능 진입점
```

#### **라우팅 파일**

```typescript
// ✅ 올바른 예시
index.tsx                # 라우트 정의
HomePage.tsx             # 홈 페이지
```

### 4. **스타일 파일**

#### **CSS 파일**

```css
// ✅ 올바른 예시
index.css                # 메인 스타일
*.module.css             # CSS 모듈 (필요시)
```

## 🔄 내보내기 규칙

### 1. **index.ts 파일 사용**

#### **컴포넌트 디렉토리**

```typescript
// src/features/poc_a/components/CharacterManager/index.ts
export { default } from './CharacterManager'
export { default as useCharacterManager } from './useCharacterManager'
```

#### **기능 모듈**

```typescript
// src/features/poc_a/index.tsx
export { default } from './components/CharacterManager'
export { default as CloudScene } from './components/CloudScene'
export { default as JsonEditor } from './components/JsonEditor'
```

### 2. **React 19 명명된 내보내기**

```typescript
// 훅 내보내기
export { useCharacterData } from './hooks/useCharacterData'
export { useCharacterManagement } from './hooks/useCharacterManagement'
export { useOptimisticUpdate } from './hooks/useOptimisticUpdate'

// 유틸리티 내보내기
export { createAnimation } from './utils/animation'
export { calculateRanking } from './utils/ranking'
```

## 📝 React 19 네이밍 가이드라인

### 1. **의미있는 이름 사용**

```typescript
// ✅ 좋은 예시
CharacterManager // 캐릭터 관리
CloudScene // 구름 씬
JsonEditor // JSON 편집기
characterService // 캐릭터 서비스
animation // 애니메이션
useOptimisticUpdate // 낙관적 업데이트 훅

// ❌ 피해야 할 예시
Manager // 너무 일반적
Scene // 너무 일반적
Editor // 너무 일반적
service // 너무 일반적
utils // 너무 일반적
```

### 2. **React 19 일관성 유지**

```typescript
// 동일한 패턴 사용
CharacterManager // 컴포넌트
characterManager // 인스턴스/변수
useCharacterManager // 커스텀 훅
character - manager // CSS 클래스 (필요시)
```

### 3. **React 19 약어 사용**

```typescript
// ✅ 허용되는 약어
POC // Proof of Concept
API // Application Programming Interface
UI // User Interface
UX // User Experience
HOC // Higher-Order Component
Suspense // React Suspense

// ❌ 피해야 할 약어
CharMgr // CharacterManager
CloudSc // CloudScene
JsonEd // JsonEditor
```

## 🚫 금지된 네이밍

### 1. **특수 문자 사용 금지**

```typescript
// ❌ 금지
character-manager.tsx   // 하이픈
character_manager.tsx   // 언더스코어
character.manager.tsx   // 점
character manager.tsx   // 공백
```

### 2. **숫자로 시작하는 이름 금지**

```typescript
// ❌ 금지
1CharacterManager.tsx
2ndComponent.tsx
```

### 3. **예약어 사용 금지**

```typescript
// ❌ 금지
class.tsx
function.tsx
interface.tsx
type.tsx
```

## 🔧 React 19 자동화 도구

### 1. **ESLint 규칙**

```json
// eslint.config.js
{
  "rules": {
    "naming-convention": [
      "error",
      {
        "selector": "class",
        "format": ["PascalCase"]
      },
      {
        "selector": "function",
        "format": ["camelCase"]
      }
    ]
  }
}
```

### 2. **Prettier 설정**

```json
// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### 3. **TypeScript 설정 (React 19 최적화)**

```json
// tsconfig.app.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

## 📚 React 19 예시 모음

### 1. **완벽한 예시**

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── index.ts
│   │   │   └── useButton.ts
│   │   └── Card/
│   │       ├── Card.tsx
│   │       ├── index.ts
│   │       └── useCard.ts
│   └── layout/
│       ├── Header/
│       │   ├── Header.tsx
│       │   ├── index.ts
│       │   └── useHeader.ts
│       └── Sidebar/
│           ├── Sidebar.tsx
│           ├── index.ts
│           └── useSidebar.ts
├── features/
│   └── poc_a/
│       ├── components/
│       │   ├── CharacterManager/
│       │   │   ├── CharacterManager.tsx
│       │   │   ├── index.ts
│       │   │   └── useCharacterManager.ts
│       │   └── CloudScene/
│       │       ├── index.tsx
│       │       └── useCloudScene.ts
│       ├── hooks/
│       │   ├── useCharacterData.ts
│       │   ├── useCharacterManagement.ts
│       │   └── useOptimisticUpdate.ts
│       └── index.tsx
├── services/
│   └── characterService.ts
├── stores/
│   ├── characterStore.ts
│   └── screenSizeStore.ts
├── utils/
│   ├── animation.ts
│   └── ranking.ts
└── hooks/
    ├── useTransition.ts
    └── useOptimistic.ts
```

### 2. **React 19 파일명 변환 예시**

```
Component Name          → ComponentName.tsx
character service      → characterService.ts
cloud creator          → cloudCreator.ts
animation utils        → animation.ts
character store        → characterStore.ts
use optimistic update  → useOptimisticUpdate.ts
```

## 🆕 React 19 특별 규칙

### 1. **새로운 훅 파일명**

```typescript
// ✅ React 19 새로운 훅
useOptimistic.ts // useOptimistic 훅
useTransition.ts // useTransition 훅
useActionState.ts // useActionState 훅
useFormStatus.ts // useFormStatus 훅

// ✅ 커스텀 훅
useCharacterData.ts // 캐릭터 데이터 훅
useOptimisticUpdate.ts // 낙관적 업데이트 훅
```

### 2. **Suspense 관련 파일**

```typescript
// ✅ Suspense 컴포넌트
LoadingSpinner.tsx // 로딩 스피너
ErrorBoundary.tsx // 에러 경계
SuspenseWrapper.tsx // Suspense 래퍼
```

### 3. **동시 기능 관련 파일**

```typescript
// ✅ 동시 기능 훅
useConcurrent.ts // 동시 기능 훅
useDeferredValue.ts // 지연된 값 훅
useSyncExternalStore.ts // 외부 스토어 동기화 훅
```

## 🎯 요약

### **React 19 핵심 규칙**

1. **React 컴포넌트**: PascalCase (예: `CharacterManager.tsx`)
2. **TypeScript 파일**: camelCase (예: `characterService.ts`)
3. **커스텀 훅**: use로 시작하는 camelCase (예: `useCharacterData.ts`)
4. **디렉토리**: kebab-case 또는 camelCase (예: `CharacterManager/`, `poc_a/`)
5. **의미있는 이름**: 기능을 명확히 표현하는 이름 사용
6. **일관성**: 동일한 패턴을 프로젝트 전체에 적용

### **React 19 이점**

- **성능 향상**: 자동 배치 및 동시 기능 활용
- **사용자 경험**: Suspense와 낙관적 업데이트
- **개발 효율성**: 새로운 훅과 API로 코드 간소화
- **확장성**: React 19의 미래 지향적 아키텍처

---

이 규칙을 따르면 React 19의 새로운 기능들을 최대한 활용하여 프로젝트의 코드 구조가 더욱 체계적이고 이해하기 쉬워집니다. 새로운 파일을 생성할 때 이 가이드를 참고해주세요!

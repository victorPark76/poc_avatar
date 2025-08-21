# 🚀 POC Avatar 프로젝트 기술 스택

## 📋 프로젝트 개요

**프로젝트명**: POC Avatar  
**목적**: 아바타/캐릭터 시스템을 위한 Proof of Concept 애플리케이션  
**현재 상태**: React 19로 업그레이드 완료, 개발 중

---

## 🏗️ 핵심 기술 스택

### Frontend Framework & Language

- **React 19** (19.2.0-canary) - 최신 React 기능 활용
- **TypeScript** (5.8.3) - 타입 안전성 보장
- **Vite** (7.1.2) - 빠른 개발 서버 및 빌드 도구

### UI & Styling

- **Tailwind CSS** (3.4.17) - 유틸리티 퍼스트 CSS 프레임워크
- **Ant Design** (5.27.1) - 엔터프라이즈급 UI 컴포넌트 라이브러리

### 상태 관리

- **Zustand** (4.4.7) - 경량 전역 상태 관리
- **React Query** - 서버 상태 관리 및 캐싱 (메모리에서 확인됨)

### 그래픽 & 애니메이션

- **PixiJS** (8.2.6) - 고성능 2D WebGL 렌더러
- **@pixi/react** (8.0.3) - React와 PixiJS 통합
- **pixi-viewport** (6.0.3) - PixiJS 뷰포트 관리
- **@esotericsoftware/spine-pixi-v8** (4.2.90) - Spine 2D 애니메이션

### 폼 관리

- **JSONForms** (3.6.0) - JSON 스키마 기반 폼 생성
  - `@jsonforms/core`
  - `@jsonforms/react`
  - `@jsonforms/material-renderers`
  - `@jsonforms/vanilla-renderers`

### 라우팅

- **React Router DOM** (7.8.1) - 클라이언트 사이드 라우팅

### 유틸리티

- **기본 유틸리티** - 내장 JavaScript/TypeScript 기능 활용

---

## 🛠️ 개발 도구

### 패키지 매니저

- **pnpm** - 빠르고 효율적인 패키지 매니저

### 코드 품질

- **ESLint** (9.33.0) - JavaScript/TypeScript 린터
  - `typescript-eslint` (8.39.1)
  - `eslint-plugin-react-hooks` (5.2.0)
  - `eslint-plugin-react-refresh` (0.4.20)
- **Prettier** (3.6.2) - 코드 포맷터

### 빌드 & 번들링

- **Vite** - 모던 빌드 도구
- **Terser** (5.44.0) - JavaScript 압축기
- **rollup-plugin-visualizer** (6.0.3) - 번들 분석 도구

### CSS 처리

- **PostCSS** (8.5.6) - CSS 후처리기
- **Autoprefixer** (10.4.21) - CSS 벤더 프리픽스 자동 추가

### Babel

- **@babel/plugin-transform-react-jsx** (7.27.1) - JSX 변환

---

## 🎯 React 19 특별 기능

### 새로운 훅들

- `use` - Promise와 Context를 직접 사용
- `useOptimistic` - 낙관적 업데이트
- `useActionState` - 액션 상태 관리

### 성능 최적화

- **자동 배치 (Automatic Batching)** - 상태 업데이트 최적화
- **동시 기능 (Concurrent Features)** - 사용자 경험 향상
- **개선된 Suspense** - 더 나은 로딩 상태 관리

### 개발자 경험

- **React 19 DevTools** 지원
- **향상된 타입 추론**
- **더 나은 에러 메시지**

---

## 📁 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── atoms/           # 기본 UI 요소
│   ├── organisms/       # 복합 컴포넌트
│   └── layout/          # 레이아웃 컴포넌트
├── features/            # 기능별 모듈
│   ├── poc_a/          # 캐릭터 관리 시스템
│   ├── poc_spine/      # Spine 애니메이션
│   └── bon/            # 뼈대 애니메이션
├── stores/              # Zustand 상태 관리
├── services/            # API 서비스
├── hooks/               # 커스텀 훅
├── utils/               # 유틸리티 함수
└── routes/              # 라우팅 설정
```

---

## 🚀 주요 기능

### 1. POC A - 캐릭터 관리 시스템

- 캐릭터 CRUD 작업
- JSON 편집기 (JSONForms)
- React 19 Suspense 활용

### 2. POC Spine - 2D 애니메이션

- Spine 2D 애니메이션 시스템
- PixiJS 기반 렌더링
- 캐릭터 애니메이션 제어

### 3. BON - 뼈대 애니메이션

- PixiJS 기반 2D 애니메이션
- 걷기 애니메이션
- 벡터 그래픽 캐릭터

---

## ⚙️ 빌드 최적화

### 청크 분할 전략

```javascript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'ui-vendor': ['antd', '@ant-design/icons'],
  'graphics-vendor': ['pixi.js', '@pixi/react', 'pixi-viewport'],
  'spine-vendor': ['@esotericsoftware/spine-pixi-v8'],
  'forms-vendor': ['@jsonforms/core', '@jsonforms/react'],
  'state-vendor': ['zustand']
}
```

### 성능 최적화

- **Tree Shaking** - 사용하지 않는 코드 제거
- **Code Splitting** - 동적 임포트
- **Lazy Loading** - 컴포넌트 지연 로딩
- **Bundle Analysis** - 번들 크기 분석

---

## 🔧 개발 환경

### 개발 서버

```bash
pnpm dev          # HTTP 개발 서버 (포트 3002)
pnpm dev:https    # HTTPS 개발 서버
```

### 빌드

```bash
pnpm build        # 프로덕션 빌드
pnpm build:analyze # 번들 분석과 함께 빌드
pnpm build:prod   # 프로덕션 환경 빌드
```

### 코드 품질

```bash
pnpm lint         # ESLint 검사
pnpm format       # Prettier 포맷팅
pnpm format:check # 포맷팅 검사
```

---

## 📊 성능 특징

### React 19 최적화

- **자동 배치**로 상태 업데이트 최적화
- **동시 기능**으로 사용자 경험 개선
- **Suspense**로 로딩 상태 관리

### 번들 최적화

- **청크 분할**로 초기 로딩 시간 단축
- **Terser 압축**으로 파일 크기 최소화
- **Tree Shaking**으로 불필요한 코드 제거

### 그래픽 성능

- **PixiJS WebGL** 렌더링
- **Spine 애니메이션** 최적화
- **Lazy Loading**으로 리소스 효율성

---

## 🎨 UI/UX 특징

### 디자인 시스템

- **Ant Design** - 엔터프라이즈급 컴포넌트
- **Tailwind CSS** - 유틸리티 퍼스트 스타일링

### 반응형 디자인

- **모바일 우선** 접근법
- **브레이크포인트** 기반 반응형
- **접근성** 고려

### 애니메이션

- **Spine 2D** 애니메이션
- **PixiJS** 기반 그래픽
- **CSS 애니메이션** (Tailwind)

---

## 🔮 향후 계획

### 단기 목표

- React 19 새로운 기능 완전 활용
- 캐릭터 애니메이션 시스템 개선
- 성능 최적화

### 장기 목표

- POC Spine 애니메이션 시스템 완성
- 캐릭터 커스터마이징 도구 개발
- React 19 동시 기능 활용 확대

---

## 📚 참고 문서

- [React 19 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
- [PixiJS 공식 문서](https://pixijs.com/)
- [Spine 공식 문서](http://esotericsoftware.com/)
- [Ant Design 공식 문서](https://ant.design/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/)

---

> **이 문서는 POC Avatar 프로젝트의 기술 스택을 종합적으로 정리한 것입니다.**
> **React 19의 최신 기능을 활용하여 현대적이고 성능이 우수한 웹 애플리케이션을 구축하고 있습니다.**

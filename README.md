# React 19 + TypeScript + Vite + Tailwind CSS

이 프로젝트는 Vite, React 19, TypeScript, Tailwind CSS를 사용하여 구축된 모던 웹 애플리케이션입니다.

## 🚀 기술 스택

- **React**: 19.2.0-canary (최신 React 19 기능)
- **TypeScript**: 5.8.3
- **Vite**: 7.1.2 (빠른 빌드 도구)
- **Tailwind CSS**: 4.1.12 (유틸리티 우선 CSS 프레임워크)
- **pnpm**: 패키지 매니저

## 🆕 React 19 새로운 기능

- **자동 배치 (Automatic Batching)**: 성능 최적화
- **동시 기능 (Concurrent Features)**: 사용자 경험 향상
- **Suspense 개선**: 더 나은 로딩 상태 관리
- **메모리 사용량 최적화**: 더 효율적인 렌더링
- **TypeScript 지원 강화**: 향상된 타입 추론

## 🛠️ 개발 도구

- **Prettier**: 코드 포맷팅
- **ESLint**: 코드 품질 검사
- **@vitejs/plugin-react**: React 19 최적화된 Vite 플러그인

## 📦 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

## 🎨 코드 품질 관리

### 자동 포맷팅

**VS Code 설정**:

- `.vscode/settings.json`에 저장 시 자동 포맷팅 설정
- Prettier를 기본 포맷터로 설정
- 저장 시 ESLint 자동 수정

**필요한 VS Code 확장 프로그램**:

- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- TypeScript Importer

### 코드 품질 관리

```bash
# 수동 포맷팅
pnpm format

# 포맷팅 검사
pnpm format:check

# 린트 검사
pnpm lint
```

## 🎯 주요 기능

- ⚡ Vite의 빠른 HMR (Hot Module Replacement)
- 🎨 Tailwind CSS를 활용한 모던한 UI
- 🔧 TypeScript로 타입 안전성 보장
- 📝 자동 코드 포맷팅
- 🚀 최적화된 프로덕션 빌드
- 🆕 React 19의 최신 기능 활용

## 📁 프로젝트 구조

```
src/
├── App.tsx          # 메인 애플리케이션 컴포넌트 (React 19 최적화)
├── main.tsx         # 애플리케이션 진입점 (React 19 렌더링)
├── index.css        # Tailwind CSS 디렉티브
├── components/      # 재사용 가능한 컴포넌트
├── features/        # 기능별 모듈
├── stores/          # 상태 관리 (Zustand)
└── assets/          # 정적 자산
```

## 🔧 설정 파일

- `tailwind.config.js` - Tailwind CSS 설정
- `postcss.config.js` - PostCSS 설정
- `.prettierrc` - Prettier 설정
- `eslint.config.js` - ESLint 설정
- `tsconfig.json` - TypeScript 설정 (React 19 최적화)
- `vite.config.ts` - Vite 설정 (React 19 플러그인)

## 🚀 React 19 마이그레이션 가이드

### 주요 변경사항

1. **JSX 변환**: 자동 JSX 변환으로 더 간단한 설정
2. **타입 정의**: React 19 타입 정의 사용
3. **성능 최적화**: 자동 배치 및 동시 기능 활용
4. **Suspense**: 개선된 로딩 상태 관리

### 개발 시 주의사항

- React 19의 새로운 훅과 API 활용
- 동시 기능을 활용한 사용자 경험 개선
- TypeScript 5.8+ 호환성 확인

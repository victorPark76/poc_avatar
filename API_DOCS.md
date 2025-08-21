# API 문서 (API Documentation)

## 📋 개요

이 문서는 POC Avatar 프로젝트에서 사용되는 API 인터페이스, 서비스, 데이터 모델을 설명합니다.

## 🏗️ 아키텍처 개요

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Layer      │    │  Service Layer  │    │  Data Layer     │
│                 │◄──►│                 │◄──►│                 │
│ - Components    │    │ - API Services  │    │ - Mock Data     │
│ - Hooks         │    │ - State Mgmt    │    │ - Local Storage │
│ - Stores        │    │ - Utils         │    │ - External APIs │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔌 API 서비스

### CharacterService

캐릭터 데이터를 관리하는 핵심 서비스입니다.

```typescript
// src/services/characterService.ts
export interface CharacterService {
  getCharacters(): Promise<Character[]>
  getCharacter(id: string): Promise<Character | null>
  createCharacter(character: CreateCharacterDto): Promise<Character>
  updateCharacter(id: string, updates: UpdateCharacterDto): Promise<Character>
  deleteCharacter(id: string): Promise<boolean>
}
```

#### 메서드 상세

| 메서드                      | 설명             | 파라미터                           | 반환값                       |
| --------------------------- | ---------------- | ---------------------------------- | ---------------------------- |
| `getCharacters()`           | 모든 캐릭터 조회 | 없음                               | `Promise<Character[]>`       |
| `getCharacter(id)`          | 특정 캐릭터 조회 | `id: string`                       | `Promise<Character \| null>` |
| `createCharacter(data)`     | 새 캐릭터 생성   | `CreateCharacterDto`               | `Promise<Character>`         |
| `updateCharacter(id, data)` | 캐릭터 정보 수정 | `id: string`, `UpdateCharacterDto` | `Promise<Character>`         |
| `deleteCharacter(id)`       | 캐릭터 삭제      | `id: string`                       | `Promise<boolean>`           |

### Mock API

개발 및 테스트를 위한 목 API 구현체입니다.

```typescript
// src/features/poc_a/mock/api.ts
export const mockCharacterAPI = {
  characters: mockCharacters,

  async getCharacters(): Promise<Character[]> {
    // 실제 API 호출을 시뮬레이션
    await delay(500)
    return [...this.characters]
  },

  async createCharacter(data: CreateCharacterDto): Promise<Character> {
    const newCharacter: Character = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.characters.push(newCharacter)
    return newCharacter
  },
}
```

## 📊 데이터 모델

### Character 인터페이스

```typescript
interface Character {
  id: string // 고유 식별자
  name: string // 캐릭터 이름
  level: number // 레벨
  experience: number // 경험치
  health: number // 체력
  mana: number // 마나
  strength: number // 힘
  agility: number // 민첩성
  intelligence: number // 지능
  inventory: InventoryItem[] // 인벤토리 아이템
  skills: Skill[] // 보유 스킬
  createdAt: Date // 생성일
  updatedAt: Date // 수정일
}

interface InventoryItem {
  id: string
  name: string
  type: ItemType
  quantity: number
  rarity: Rarity
}

interface Skill {
  id: string
  name: string
  level: number
  cooldown: number
  manaCost: number
}
```

### DTO (Data Transfer Object)

```typescript
// 생성용 DTO
interface CreateCharacterDto {
  name: string
  level?: number
  experience?: number
  health?: number
  mana?: number
  strength?: number
  agility?: number
  intelligence?: number
}

// 수정용 DTO
interface UpdateCharacterDto {
  name?: string
  level?: number
  experience?: number
  health?: number
  mana?: number
  strength?: number
  agility?: number
  intelligence?: number
}
```

## 🎣 커스텀 훅

### useCharacterData

캐릭터 데이터를 조회하는 커스텀 훅입니다.

```typescript
// src/features/poc_a/hooks/useCharacterData.ts
export const useCharacterData = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['characters'],
    queryFn: characterService.getCharacters,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  })

  return {
    characters: data || [],
    isLoading,
    error: error?.message,
  }
}
```

### useCharacterManagement

캐릭터 관리 기능을 제공하는 커스텀 훅입니다.

```typescript
// src/features/poc_a/hooks/useCharacterManagement.ts
export const useCharacterManagement = () => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: characterService.createCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCharacterDto }) =>
      characterService.updateCharacter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] })
    },
  })

  return {
    createCharacter: createMutation.mutate,
    updateCharacter: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  }
}
```

## 🗄️ 상태 관리

### CharacterStore (Zustand)

```typescript
// src/stores/characterStore.ts
interface CharacterStore {
  // 상태
  characters: Character[]
  selectedCharacter: Character | null
  isLoading: boolean
  error: string | null

  // 액션
  setCharacters: (characters: Character[]) => void
  addCharacter: (character: Character) => void
  updateCharacter: (id: string, updates: Partial<Character>) => void
  deleteCharacter: (id: string) => void
  selectCharacter: (character: Character | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  // 초기 상태
  characters: [],
  selectedCharacter: null,
  isLoading: false,
  error: null,

  // 액션 구현
  setCharacters: characters => set({ characters }),
  addCharacter: character =>
    set(state => ({
      characters: [...state.characters, character],
    })),
  updateCharacter: (id, updates) =>
    set(state => ({
      characters: state.characters.map(char =>
        char.id === id ? { ...char, ...updates, updatedAt: new Date() } : char
      ),
    })),
  deleteCharacter: id =>
    set(state => ({
      characters: state.characters.filter(char => char.id !== id),
    })),
  selectCharacter: character => set({ selectedCharacter: character }),
  setLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error }),
}))
```

### ScreenSizeStore

화면 크기 정보를 관리하는 스토어입니다.

```typescript
// src/stores/screenSizeStore.ts
interface ScreenSizeStore {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  updateSize: (width: number, height: number) => void
}

export const useScreenSizeStore = create<ScreenSizeStore>(set => ({
  width: 0,
  height: 0,
  isMobile: false,
  isTablet: false,
  isDesktop: false,

  updateSize: (width, height) => {
    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024
    const isDesktop = width >= 1024

    set({ width, height, isMobile, isTablet, isDesktop })
  },
}))
```

## 🔄 데이터 플로우

### 캐릭터 생성 플로우

```
1. UI에서 폼 제출
   ↓
2. useCharacterManagement.createCharacter 호출
   ↓
3. CharacterService.createCharacter 실행
   ↓
4. Mock API에서 데이터 생성
   ↓
5. Zustand 스토어 업데이트
   ↓
6. React Query 캐시 무효화
   ↓
7. UI 자동 리렌더링
```

### 캐릭터 수정 플로우

```
1. JSON 에디터에서 데이터 변경
   ↓
2. onChange 이벤트 발생
   ↓
3. useCharacterManagement.updateCharacter 호출
   ↓
4. CharacterService.updateCharacter 실행
   ↓
5. Mock API에서 데이터 업데이트
   ↓
6. Zustand 스토어 업데이트
   ↓
7. React Query 캐시 무효화
   ↓
8. UI 자동 리렌더링
```

## 🧪 테스트 데이터

### Mock Characters

```typescript
export const mockCharacters: Character[] = [
  {
    id: '1',
    name: '아서',
    level: 15,
    experience: 1250,
    health: 120,
    mana: 80,
    strength: 18,
    agility: 14,
    intelligence: 12,
    inventory: [],
    skills: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: '리나',
    level: 12,
    experience: 800,
    health: 100,
    mana: 120,
    strength: 10,
    agility: 16,
    intelligence: 20,
    inventory: [],
    skills: [],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
]
```

## 🚀 확장 계획

### 향후 추가될 API

1. **Authentication API**
   - 사용자 로그인/로그아웃
   - JWT 토큰 관리
   - 권한 관리

2. **Asset Management API**
   - 이미지 업로드/다운로드
   - 에셋 메타데이터 관리
   - CDN 연동

3. **Animation API**
   - 애니메이션 시퀀스 저장
   - 키프레임 데이터 관리
   - 애니메이션 재생 제어

4. **Social Features API**
   - 캐릭터 공유
   - 커뮤니티 기능
   - 평가 및 댓글

## 🔧 에러 처리

### 에러 타입

```typescript
interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
}

// 일반적인 에러 코드
enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
```

### 에러 처리 패턴

```typescript
try {
  const result = await characterService.createCharacter(data)
  // 성공 처리
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case ErrorCode.VALIDATION_ERROR:
        // 유효성 검사 에러 처리
        break
      case ErrorCode.NOT_FOUND:
        // 리소스 없음 에러 처리
        break
      default:
      // 기타 에러 처리
    }
  }
}
```

---

이 API 문서를 통해 프로젝트의 데이터 흐름과 서비스 구조를 이해할 수 있습니다. 추가 질문이나 개선사항이 있으면 언제든지 문의해주세요!

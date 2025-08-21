# 🎭 Spine 애니메이션 확인 가이드

## 🔍 Spine 캐릭터의 사용 가능한 애니메이션을 확인하는 방법

### 1. **JSON 파일에서 직접 확인**

#### 터미널에서 확인하기

```bash
# 애니메이션 섹션 찾기
grep -n "animations" public/images/캐릭터명.json

# 애니메이션 이름들 찾기
grep -A 5 '"animations":' public/images/캐릭터명.json

# 특정 애니메이션 이름 검색
grep -n '"애니메이션명":' public/images/캐릭터명.json
```

#### 실제 예시

```bash
# dragon 캐릭터의 애니메이션 확인
grep -n "animations" public/images/dragon-ess.json
# 결과: 452:"animations": {

# chibi-stickers 캐릭터의 애니메이션 확인
grep -n "animations" public/images/chibi-stickers.json
# 결과: 1908:"animations": {
```

### 2. **코드에서 동적으로 확인**

#### SpinePreview 컴포넌트에 디버깅 코드 추가

```typescript
// Spine 인스턴스가 생성된 후
if (spine && spine.skeleton && spine.skeleton.data) {
  const animations = spine.skeleton.data.animations
  console.log(
    '사용 가능한 애니메이션:',
    animations.map(anim => anim.name)
  )

  // 각 애니메이션의 상세 정보
  animations.forEach(anim => {
    console.log(`애니메이션: ${anim.name}, 길이: ${anim.duration}초`)
  })
}
```

#### 실제 구현 예시

```typescript
const addSpine = useCallback(() => {
  if (!containerRef.current) return
  try {
    const spine = Spine.from({
      skeleton: aliases.skeleton,
      atlas: aliases.atlas,
      scale: 1,
      autoUpdate: true,
    })

    // 애니메이션 목록 출력
    if (spine.skeleton && spine.skeleton.data) {
      const animations = spine.skeleton.data.animations
      console.log('🎭 사용 가능한 애니메이션 목록:')
      animations.forEach(anim => {
        console.log(`  - ${anim.name} (${anim.duration}초)`)
      })
    }

    spineRef.current = spine
    // ... 나머지 코드
  } catch (e) {
    console.error('Failed to create Spine:', e)
  }
}, [])
```

### 3. **일반적인 애니메이션 이름 패턴**

#### 이동 관련

- `walk` - 걷기
- `run` - 뛰기
- `idle` - 대기
- `jump` - 점프
- `fly` - 날기
- `swim` - 수영

#### 감정 표현

- `happy` - 기쁨
- `sad` - 슬픔
- `angry` - 화남
- `surprised` - 놀람
- `confused` - 혼란
- `excited` - 흥분

#### 액션

- `attack` - 공격
- `defend` - 방어
- `cast` - 마법 시전
- `dance` - 춤
- `wave` - 손 흔들기

#### 방향별 (chibi-stickers 스타일)

- `movement/idle-front` - 정면 대기
- `movement/idle-back` - 후면 대기
- `movement/idle-left` - 좌측 대기
- `movement/idle-right` - 우측 대기
- `movement/trot-front` - 정면 트롯
- `movement/trot-back` - 후면 트롯

#### 감정별 (chibi-stickers 스타일)

- `emotes/happy` - 기쁨
- `emotes/angry` - 화남
- `emotes/confused` - 혼란
- `emotes/crying` - 울음
- `emotes/excited` - 흥분
- `emotes/laugh` - 웃음

### 4. **실제 프로젝트에서 확인한 애니메이션들**

#### 🐉 Dragon 캐릭터

```json
"animations": {
  "flying": {
    // 드래곤이 날아다니는 애니메이션
  }
}
```

- **사용 가능**: `flying`

#### 🎭 Chibi-stickers 캐릭터

```json
"animations": {
  "emotes/angry": { ... },
  "emotes/burp": { ... },
  "emotes/confused": { ... },
  "emotes/crying": { ... },
  "emotes/dead": { ... },
  "emotes/determined": { ... },
  "emotes/dramatic-stare": { ... },
  "emotes/excited": { ... },
  "emotes/fawning": { ... },
  "emotes/flushed": { ... },
  "emotes/hooray": { ... },
  "emotes/idea": { ... },
  "emotes/just-right": { ... },
  "emotes/laugh": { ... },
  "emotes/love": { ... },
  "emotes/scared": { ... },
  "emotes/see-no-evil": { ... },
  "emotes/shrug": { ... },
  "emotes/sulk": { ... },
  "emotes/sweat": { ... },
  "emotes/thinking": { ... },
  "emotes/tongue-out": { ... },
  "emotes/wave": { ... },
  "movement/idle-back": { ... },
  "movement/idle-front": { ... },
  "movement/idle-left": { ... },
  "movement/idle-right": { ... },
  "movement/trot-back": { ... },
  "movement/trot-front": { ... },
  "movement/trot-left": { ... },
  "movement/trot-right": { ... }
}
```

#### 🏃 Spineboy 캐릭터

```json
"animations": {
  "aim": { ... },
  "death": { ... },
  "idle": { ... },
  "jump": { ... },
  "run": { ... },
  "walk": { ... }
}
```

### 5. **오류 해결 팁**

#### "Animation not found" 오류가 발생할 때

1. **정확한 애니메이션 이름 확인**

   ```bash
   grep -n '"애니메이션명":' public/images/캐릭터명.json
   ```

2. **대소문자 구분 확인**
   - `walk` ≠ `Walk` ≠ `WALK`

3. **슬래시(/)나 하이픈(-) 포함 여부 확인**
   - `movement/idle-front` (올바름)
   - `movement_idle_front` (잘못됨)

4. **기본값으로 안전한 애니메이션 사용**
   ```typescript
   // 안전한 기본값들
   initialAnimation = 'idle' // 대부분의 캐릭터에 있음
   initialAnimation = 'movement/idle-front' // chibi-stickers 스타일
   ```

### 6. **개발자 도구에서 확인**

#### 브라우저 콘솔에서 확인

```javascript
// Spine 인스턴스가 로드된 후
const spine = document.querySelector('canvas').__PIXI_APP__.stage.children[0]
if (spine && spine.skeleton) {
  const animations = spine.skeleton.data.animations
  console.table(
    animations.map(anim => ({
      name: anim.name,
      duration: anim.duration,
      tracks: anim.tracks.length,
    }))
  )
}
```

### 7. **유용한 명령어 모음**

```bash
# 모든 JSON 파일에서 애니메이션 섹션 찾기
find public/images -name "*.json" -exec grep -l "animations" {} \;

# 특정 캐릭터의 모든 애니메이션 이름 추출
grep -o '"[^"]*": {' public/images/캐릭터명.json | grep -A 1 '"animations"' | tail -n +2

# 애니메이션 개수 확인
grep -c '": {' public/images/캐릭터명.json
```

---

## 📝 요약

1. **JSON 파일 직접 확인** - 가장 확실한 방법
2. **코드에서 동적 확인** - 런타임에 확인 가능
3. **일반적인 네이밍 패턴** - 예측 가능한 이름들
4. **오류 해결** - 정확한 이름과 대소문자 확인
5. **개발자 도구 활용** - 브라우저에서 실시간 확인

이 가이드를 참고하여 Spine 캐릭터의 애니메이션을 효과적으로 확인하고 사용하세요! 🎭✨

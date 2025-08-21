# Spine 애니메이션 키워드 확인 방법

## 1. JSON 파일 구조 확인

Spine 에셋의 `.json` 파일을 열어보면 다음과 같은 구조를 가집니다:

```json
{
  "skeleton": {
    "hash": "...",
    "spine": "4.1.0",
    "width": 100,
    "height": 100,
    "images": "./images/",
    "audio": "./audio/"
  },
  "bones": [...],
  "slots": [...],
  "skins": [...],
  "animations": {
    "animation_name_1": {
      "bones": {...},
      "slots": {...},
      "events": {...}
    },
    "animation_name_2": {
      "bones": {...},
      "slots": {...}
    }
  }
}
```

## 2. 애니메이션 키워드 찾기

### 방법 1: JSON 파일 직접 확인
1. `.json` 파일을 텍스트 에디터로 열기
2. `"animations"` 섹션 찾기
3. 각 애니메이션의 이름이 키워드가 됩니다

```json
"animations": {
  "idle": {...},           // 키워드: "idle"
  "walk": {...},           // 키워드: "walk"
  "jump": {...},           // 키워드: "jump"
  "attack": {...},         // 키워드: "attack"
  "btn_unable": {...},     // 키워드: "btn_unable"
  "enable": {...}          // 키워드: "enable"
}
```

### 방법 2: 코드로 동적 확인
```typescript
// Spine 애니메이션 목록을 가져오는 함수
const getAnimationNames = (spine: Spine) => {
  if (!spine.skeleton) return [];
  
  const animations = spine.skeleton.data.animations;
  return animations.map(anim => anim.name);
};

// 사용 예시
useEffect(() => {
  if (spineRef.current) {
    const animationNames = getAnimationNames(spineRef.current);
    console.log('Available animations:', animationNames);
  }
}, [isReady]);
```

### 방법 3: 개발자 도구에서 확인
1. 브라우저 개발자 도구 열기
2. Console 탭에서 다음 코드 실행:
```javascript
// Spine 인스턴스가 로드된 후
const spine = document.querySelector('canvas').__PIXI_APP__.stage.children[0];
console.log('Animations:', spine.skeleton.data.animations.map(a => a.name));
```

## 3. 일반적인 애니메이션 키워드

### 캐릭터 애니메이션
- `idle` - 대기 상태
- `walk` - 걷기
- `run` - 달리기
- `jump` - 점프
- `attack` - 공격
- `hurt` - 피해
- `death` - 죽음

### UI 애니메이션
- `btn_unable` - 버튼 비활성화
- `btn_enable` - 버튼 활성화
- `enable` - 활성화
- `disable` - 비활성화
- `hover` - 호버 상태
- `click` - 클릭 상태

### 기타
- `appear` - 나타나기
- `disappear` - 사라지기
- `loop` - 반복 애니메이션
- `attention` - 주의 끌기
- `notification` - 알림

## 4. SpinePreview 컴포넌트에서 사용

```tsx
<SpinePreview
  skeletonSrc="/path/to/skeleton.json"
  atlasSrc="/path/to/atlas.atlas"
  initialAnimation="idle"  // 여기에 확인한 키워드 사용
  background="transparent"
  backgroundAlpha={0}
/>
```

## 5. 애니메이션 전환

```typescript
// 애니메이션 변경
const changeAnimation = (animationName: string) => {
  if (spineRef.current) {
    spineRef.current.state.setAnimation(0, animationName, true);
  }
};
```

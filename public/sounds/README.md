# Spine 애니메이션 효과음

이 폴더에는 Spine 애니메이션에서 사용되는 효과음 파일들이 저장됩니다.

## ⚠️ 현재 상태

**사운드 파일이 없지만 Web Audio API로 생성된 효과음이 자동으로 재생됩니다!** 🎵

실제 사운드 파일을 사용하려면 아래 방법으로 추가하세요.

## 지원되는 파일 형식

- MP3
- WAV
- OGG
- M4A

## 권장 사운드 파일들

### 기본 캐릭터 사운드

- `walk.mp3` - 걷기 소리 (발걸음)
- `run.mp3` - 달리기 소리
- `jump.mp3` - 점프 소리
- `land.mp3` - 착지 소리

### UI 사운드

- `button_click.mp3` - 버튼 클릭 소리
- `button_hover.mp3` - 버튼 호버 소리
- `notification.mp3` - 알림 소리

### 환경 사운드

- `wind.mp3` - 바람 소리
- `ambient.mp3` - 배경 환경음

## 🎵 사운드 시스템

### 현재 작동 방식

1. **자동 대체**: 사운드 파일이 없으면 Web Audio API로 생성된 효과음이 자동 재생됩니다
2. **실시간 생성**: 발걸음, 점프, 버튼 클릭 등의 효과음을 실시간으로 생성
3. **브라우저 호환**: 모든 모던 브라우저에서 작동

### 🎵 사운드 파일 추가 방법 (선택사항)

#### 방법 1: 무료 사운드 다운로드

1. **FreeSound.org** (https://freesound.org/) - 무료 효과음 라이브러리
2. **SoundBible.com** (https://soundbible.com/) - 무료 효과음 모음
3. **Zapsplat** (https://www.zapsplat.com/) - 고품질 효과음 (무료 계정 필요)

#### 방법 2: 직접 제작

- **Audacity** (무료 오디오 편집기) 사용
- 간단한 효과음은 녹음으로도 제작 가능

#### 방법 3: 코드에서 사운드 활성화

1. 이 폴더에 원하는 사운드 파일을 추가합니다.
2. `src/features/poc_spine/components/SpineContainer.tsx`에서 주석 처리된 `soundConfigs` 배열의 주석을 해제합니다:

```typescript
const soundConfigs: SoundConfig[] = [
  // 기존 사운드들...
  {
    name: 'new_sound',
    src: '/sounds/new_sound.mp3',
    volume: 0.5,
    preload: true,
  },
]
```

3. Spine 애니메이션 이벤트와 연결하려면:

```typescript
newSpineBoy.addSoundEvent('event_name', 'new_sound')
```

## 사운드 최적화 팁

- 파일 크기를 최소화하기 위해 적절한 압축을 사용하세요
- 짧은 효과음은 1-3초 정도로 제한하세요
- 배경음악은 별도로 관리하는 것을 권장합니다
- 모바일 환경을 고려하여 파일 크기를 최적화하세요

## 브라우저 호환성

- MP3: 모든 모던 브라우저 지원
- WAV: 모든 브라우저 지원 (파일 크기 큼)
- OGG: Firefox, Chrome 지원
- M4A: Safari, Chrome 지원

// PixiJS 라이브러리에서 필요한 클래스들을 가져옴
import {
  Application,
  Container,
  Graphics,
  Text,
  TextStyle,
  Ticker,
} from 'pixi.js'

// 애니메이션 유틸리티 import
import { createCharacterAnimations } from '../utils/animation'

// CSS 색상 문자열을 PixiJS 색상 숫자로 변환하는 헬퍼 함수
const hexToPixiColor = (color: string): number => {
  // #ff0000 -> 0xff0000 변환
  const cleanColor = color.startsWith('#') ? color : `#${color}`
  return parseInt(cleanColor.replace('#', '0x'), 16)
}

// 캐릭터 생성 시 사용할 설정 옵션들을 정의하는 인터페이스
export interface CharacterConfig {
  x?: number // 캐릭터의 X축 위치 (선택사항, 기본값: 100)
  y?: number // 캐릭터의 Y축 위치 (선택사항, 기본값: 300)
  width?: number // 캐릭터의 너비 (선택사항, 기본값: 50)
  height?: number // 캐릭터의 높이 (선택사항, 기본값: 50)
  tint?: number // 캐릭터의 색상 (선택사항, 기본값: 0xff6b6b)
  name?: string // 캐릭터의 이름 (선택사항, 기본값: '')
  face?: string // 캐릭터의 얼굴 색상 (선택사항, 기본값: '')
  body?: string // 캐릭터의 몸통 색상 (선택사항, 기본값: '')
  type?: string // 캐릭터의 타입 (선택사항, 기본값: '')
  rank?: number // 캐릭터의 등급 (선택사항, 기본값: 0)
}

/**
 * 캐릭터 Container를 생성하고 ticker에 추가하는 함수
 * @param app PIXI 애플리케이션 인스턴스 - 캔버스와 스테이지를 관리
 * @param config 캐릭터 설정 - 위치, 크기, 색상 등의 옵션
 * @param width 화면 너비
 * @returns 생성된 캐릭터 Container와 개별 ticker를 포함한 객체
 */
export const createCharacter = (
  app: Application, // PixiJS 애플리케이션 객체
  config: CharacterConfig = {},
  width: number // 화면 너비
): { character: Container; characterTicker: Ticker } => {
  // width를 기준으로 상대비율 계산 (4:3 비율)
  const baseWidth = 800 // 기준 너비 (4:3)
  const ratio = width / baseWidth

  // 설정에서 x, y 값을 가져오고, 없으면 기본값 사용 (비율에 맞춰 조정)
  const { x = 100 * ratio, y = 500 * ratio } = config
  const upperArmLen = 20 * ratio
  const lowerArmLen = 26 * ratio

  // 메인 캐릭터 Container 생성 - 모든 캐릭터 부품들을 담는 최상위 컨테이너
  const character = new Container()
  character.x = x // 설정된 X 위치로 설정
  character.y = y // 설정된 Y 위치로 설정
  character.sortableChildren = true // 자식 요소들의 z-index 정렬 활성화 (겹침 순서 제어)

  // 뼈대(팔, 다리 등)를 생성하는 내부 함수 (현재 사용하지 않음)
  // const createBone = (length: number, thickness = 10, color = 0xffffff) => {
  //   const bone = new Container() // 뼈대를 담을 컨테이너 생성
  //   const g = new Graphics() // 그래픽 객체 생성 (도형 그리기용)
  //   g.beginFill(color) // 지정된 색상으로 채우기 시작
  //   g.drawRoundedRect(-thickness / 2, 0, thickness, length, thickness / 2) // 둥근 모서리 직사각형 그리기
  //   g.endFill() // 채우기 완료
  //   bone.addChild(g) // 그래픽을 뼈대 컨테이너에 추가
  //   // 관절(상단)을 피벗으로 설정. 회전은 (0,0)을 중심으로 발생
  //   // 뼈대의 중심점을 상단 관절 위치로 조정
  //   g.pivot.set(0, 0) // 피벗 포인트를 (0,0)으로 설정 (회전 중심점)
  //   return bone // 완성된 뼈대 컨테이너 반환
  // }

  // 재사용 가능한 뼈대 조각을 만드는 함수
  const createBone = (length: number, thickness = 10, color = 0xffffff) => {
    const bone = new Container()
    const g = new Graphics()
    g.beginFill(color)
    g.drawRoundedRect(-thickness / 2, 0, thickness, length, thickness / 2)
    g.endFill()
    bone.addChild(g)
    // 관절(상단)을 피벗으로 설정. 회전은 (0,0)을 중심으로 발생
    // 뼈대의 중심점을 상단 관절 위치로 조정
    g.pivot.set(0, 0)
    return bone
  }

  // 몸통 생성 (파란색 둥근 사각형) - 비율에 맞춰 크기 조정
  const torso = new Container() // 몸통을 담을 컨테이너 생성
  const torsoG = new Graphics() // 몸통 그래픽 객체 생성

  // body 색상을 숫자로 변환 (16진수 문자열 -> 숫자)
  let bodyColor = 0x87cefa // 기본 하늘색
  if (config.body) {
    if (typeof config.body === 'string') {
      bodyColor = hexToPixiColor(config.body)
    } else {
      bodyColor = config.body
    }
  }

  const torsoWidth = 60 * ratio
  const torsoHeight = 60 * ratio
  const torsoRadius = 10 * ratio

  torsoG.beginFill(bodyColor)
  torsoG.drawRoundedRect(
    -torsoWidth / 2,
    0, // 몸통을 아래쪽부터 그리기 시작 (0부터 시작)
    torsoWidth,
    torsoHeight,
    torsoRadius
  ) // 둥근 모서리 직사각형 그리기 (아래쪽 기준, 비율에 맞춰 조정)
  torsoG.endFill() // 채우기 완료

  // 몸통의 중심점을 아래쪽으로 설정 (pivot 사용)
  torsoG.pivot.set(0, torsoHeight)
  torso.y = 0 // 몸통의 Y 위치를 0으로 설정 (캐릭터 중심점)

  // 머리 생성 (살색 원형) - 비율에 맞춰 크기 조정
  const head = new Graphics() // 머리 그래픽 객체 생성

  // face 색상을 숫자로 변환 (16진수 문자열 -> 숫자)
  let headColor = 0xffe0bd // 기본 살색
  if (config.face) {
    if (typeof config.face === 'string') {
      headColor = hexToPixiColor(config.face)
    } else if (config.body) {
      headColor = hexToPixiColor(config.body)
    }
  }

  const headRadius = 30 * ratio
  const headY = -40 * ratio

  head.beginFill(headColor)
  head.drawCircle(0, headY, headRadius) // 원 그리기 (몸통 위쪽에 위치, 비율에 맞춰 조정)
  head.endFill() // 채우기 완료

  // 어깨와 엉덩이의 연결점을 몸통에 상대적으로 배치
  const sss = torsoWidth / 2
  const leftShoulder = new Container()
  leftShoulder.position.set(-sss, -torsoHeight) // 왼쪽 어깨 위치 (몸통 상단)
  const rightShoulder = new Container()
  rightShoulder.position.set(sss, -torsoHeight) // 오른쪽 어깨 위치 (몸통 상단)

  // 팔은 두 개의 뼈대로 구성: 상완(위팔) + 전완(아래팔)
  // --- 왼쪽 팔 ---
  const upperArmL = createBone(upperArmLen, 8, 0xffffff) // 상완 (위팔)
  const lowerArmL = createBone(lowerArmLen, 7, 0xffffff) // 전완 (아래팔)

  lowerArmL.y = upperArmLen // 상완 끝에 전완 연결
  upperArmL.addChild(lowerArmL)
  // --- 오른쪽 팔 ---
  const upperArmR = createBone(upperArmLen, 8, 0xffffff) // 상완 (위팔)
  const lowerArmR = createBone(lowerArmLen, 7, 0xffffff) // 전완 (아래팔)

  lowerArmR.y = upperArmLen // 상완 끝에 전완 연결
  upperArmR.addChild(lowerArmR)
  // 팔이 어깨에 정확히 붙도록 위치 조정
  upperArmL.x = 0 // 어깨 컨테이너의 중심에 맞춤
  upperArmL.y = 0 // 어깨 컨테이너의 상단에 맞춤
  upperArmR.x = 0 // 어깨 컨테이너의 중심에 맞춤
  upperArmR.y = 0 // 어깨 컨테이너의 상단에 맞춤

  // --- 어깨에 팔 연결 ---
  leftShoulder.addChild(upperArmL)
  rightShoulder.addChild(upperArmR)
  // 몸통 컨테이너에 몸통 그래픽과 머리를 자식으로 추가
  torso.addChild(torsoG, head, rightShoulder, leftShoulder)

  // 이름 텍스트 추가 (몸통 위에 표시)
  if (config.name) {
    console.log('이름표 생성:', config.name) // 디버깅 로그

    // 이름표 배경 (몸통에 붙어있는 형태)
    const nameTag = new Graphics()
    nameTag.beginFill(0xffffff) // 흰색 배경
    nameTag.lineStyle(2 * ratio, 0x000000) // 검은색 테두리
    const nameY = 40
    const nameTagWidth = Math.max(config.name.length * 12 * ratio, 80 * ratio)
    const nameTagHeight = 25 * ratio
    const nameTagRadius = nameY * ratio
    const namePositon = 27
    // 이름표를 몸통 위에 붙여서 그리기 (몸통 아래쪽 기준)
    nameTag.drawRoundedRect(
      -nameTagWidth / 2,
      -nameTagHeight + namePositon * ratio, // 몸통 위쪽에 이름표 위치 (10 * ratio만큼 위로 올림)
      nameTagWidth,
      nameTagHeight,
      nameTagRadius
    )
    nameTag.endFill()

    // 이름표의 z-index를 높게 설정
    nameTag.zIndex = 1000

    // 이름 텍스트
    const nameText = new Text(
      config.name,
      new TextStyle({
        fontFamily: 'Arial',
        fontSize: 11 * ratio,
        fill: 0x000000,
        fontWeight: 'bold',
        align: 'center',
      })
    )

    // 텍스트를 이름표 중앙에 정렬 (몸통 아래쪽 기준)
    nameText.anchor.set(0.5, 0.5)
    nameText.y = -nameTagHeight / 2 + namePositon * ratio // 이름표 중앙에 텍스트 위치 (10 * ratio만큼 위로 올림)

    // 텍스트의 z-index도 높게 설정
    nameText.zIndex = 1001

    // 이름표와 텍스트를 메인 캐릭터 컨테이너에 추가
    character.addChild(nameTag, nameText)

    console.log('이름표 위치:', {
      x: 0,
      y: -nameTagHeight - 10 * ratio, // 몸통 위쪽에 이름표 위치 (10 * ratio만큼 위로 올림)
      width: nameTagWidth,
      height: nameTagHeight,
    })
  }

  // 메인 캐릭터 컨테이너에 몸통을 자식으로 추가
  character.addChild(torso)

  // PixiJS 스테이지(캔버스)에 완성된 캐릭터를 추가하여 화면에 표시
  app.stage.addChild(character) // 맨 뒤에 배치

  // 애니메이션 함수 생성 및 ticker에 등록
  const updateCharacter = createCharacterAnimations(
    character,
    head,
    headY,
    y,
    ratio,
    upperArmL,
    lowerArmL,
    upperArmR,
    lowerArmR,
    config.rank // rank 정보 전달
  )

  // ticker에 업데이트 함수를 등록하여 매 프레임마다 애니메이션이 실행되도록 함
  const characterTicker = new Ticker()
  characterTicker.add(() => {
    const time = Date.now() * 0.003
    updateCharacter(time)
  })

  // 완성된 캐릭터 컨테이너를 반환 (호출자가 추가 조작 가능)
  return { character, characterTicker }
}

/**
 * 캐릭터를 제거하는 함수
 * @param character 제거할 캐릭터 Container - 화면에서 사라지게 할 캐릭터
 */
export const removeCharacter = (character: Container): void => {
  // 캐릭터가 부모 컨테이너에 있다면 부모에서 제거
  if (character.parent) {
    character.parent.removeChild(character) // 부모 컨테이너에서 자식 제거
  }
  // ticker에서 업데이트 함수 제거 로직이 필요하다면 여기에 추가
  // (현재는 구현되지 않음)
}

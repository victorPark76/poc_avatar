const fs = require('fs')
const path = require('path')

// public/sounds 디렉토리 생성
const soundsDir = path.join(__dirname, '..', 'public', 'sounds')
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true })
}

// 점프 사운드 MP3 파일들 생성 (더미 파일)
const jumpSounds = [
  'jump_01.mp3',
  'jump_02.mp3',
  'jump_03.mp3',
  'jump_simple.mp3',
  'jump_pulse.mp3',
]

console.log('🎵 점프 사운드 MP3 파일 생성 중...')

jumpSounds.forEach(soundFile => {
  const filePath = path.join(soundsDir, soundFile)

  // 간단한 MP3 헤더를 포함한 더미 파일 생성
  // 실제로는 Web Audio API로 생성된 사운드를 사용하지만,
  // 파일이 존재하는 것처럼 보이게 하기 위해 더미 파일 생성
  const dummyMp3Content = Buffer.from([
    0xff,
    0xfb,
    0x90,
    0x00, // MP3 헤더
    0x00,
    0x00,
    0x00,
    0x00, // 더미 데이터
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
  ])

  fs.writeFileSync(filePath, dummyMp3Content)
  console.log(`✅ 생성됨: ${soundFile}`)
})

console.log('🎉 모든 점프 사운드 파일이 생성되었습니다!')
console.log('📁 위치: public/sounds/')
console.log(
  '⚠️  참고: 이는 더미 파일입니다. 실제 사운드는 Web Audio API로 생성됩니다.'
)

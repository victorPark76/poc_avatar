#!/usr/bin/env node

/**
 * 테스트용 더미 사운드 파일 생성 스크립트
 * 실제 사운드 파일이 없을 때 테스트용으로 사용
 */

const fs = require('fs');
const path = require('path');

// public/sounds 디렉토리 경로
const soundsDir = path.join(__dirname, '..', 'public', 'sounds');

// 더미 사운드 파일 생성 함수
function createDummySoundFile(filename, duration = 1000) {
  // 매우 짧은 무음 MP3 헤더 (실제로는 재생되지 않지만 파일은 존재)
  const dummyMp3Header = Buffer.from([
    0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);
  
  const filePath = path.join(soundsDir, filename);
  fs.writeFileSync(filePath, dummyMp3Header);
  console.log(`✅ 생성됨: ${filename}`);
}

// sounds 디렉토리가 없으면 생성
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
  console.log(`📁 디렉토리 생성: ${soundsDir}`);
}

console.log('🎵 테스트용 더미 사운드 파일 생성 중...\n');

// 기본 사운드 파일들 생성
const soundFiles = [
  'walk.mp3',
  'run.mp3', 
  'jump.mp3',
  'land.mp3',
  'button_click.mp3',
  'button_hover.mp3',
  'notification.mp3',
  'wind.mp3',
  'ambient.mp3'
];

soundFiles.forEach(filename => {
  createDummySoundFile(filename);
});

console.log('\n🎉 더미 사운드 파일 생성 완료!');
console.log('\n⚠️  주의: 이 파일들은 실제 사운드가 아닙니다.');
console.log('실제 사운드를 사용하려면 위 파일들을 진짜 MP3 파일로 교체하세요.');
console.log('\n📝 다음 단계:');
console.log('1. SpineContainer.tsx에서 사운드 설정 주석 해제');
console.log('2. 실제 MP3 파일로 교체');
console.log('3. 애니메이션과 함께 사운드 테스트');

import CloudDrift from '@/components/organisms/CloudScene'

const Test = () => {
  // 여러 구름 설정
  const clouds = [
    {
      src: '/images/cloud.png',
      travel: 300,
      speed: 1.2,
      y: 60,
      startOffsetX: -200,
      scale: 1.0,
    },
    {
      src: '/images/cloud.png',
      travel: 400,
      speed: 0.8,
      y: 20,
      startOffsetX: -300,
      scale: 0.8,
    },
    {
      src: '/images/cloud.png',
      travel: 250,
      speed: 1.5,
      y: 120,
      startOffsetX: -150,
      scale: 1.2,
    },
  ]

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      {/* <div ref={pixiContainer} /> */}

      {/* 하나의 하늘에 여러 구름 */}
      <CloudDrift
        clouds={clouds}
        width={720}
        height={360}
        background={0x87ceeb}
        backgroundSrc="/images/background_trimmed2.png"
      />
    </div>
  )
}

export default Test

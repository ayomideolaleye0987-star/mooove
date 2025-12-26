import React from 'react'
import Lottie from 'lottie-react'
import locker from '/public/animations/locker.json'

export default function LockerLottie() {
  return (
    <div style={{width:160}}>
      <Lottie animationData={locker} loop={true} />
    </div>
  )
}

import React from 'react'
import Lottie from 'lottie-react'
import stamp from '/public/animations/stamp.json'

export default function StampLottie({ size = 80 }) {
  return (
    <div style={{width:size}}>
      <Lottie animationData={stamp} loop={false} />
    </div>
  )
}

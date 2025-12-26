import React from 'react'
import Lottie from 'lottie-react'
import pile from '/public/animations/evidence-pile.json'

export default function EvidencePile({ size = 120 }) {
  return (
    <div style={{width:size}} className="mx-auto">
      <Lottie animationData={pile} loop={true} />
    </div>
  )
}

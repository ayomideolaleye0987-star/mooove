import React from 'react'
import Lottie from 'lottie-react'
import hammer from '/public/animations/judge-hammer.json'

export default function AnimatedJudgeLottie() {
  return (
    <div className="judge-container p-6 rounded-xl bg-red-50 border-4 border-red-600">
      <div className="flex items-center gap-6">
        <div style={{width:120}}>
          <Lottie animationData={hammer} loop={true} />
        </div>
        <div>
          <div className="font-black text-xl">Judge's Bench</div>
          <div className="text-sm text-gray-600">Animated hammer for verdicts</div>
        </div>
      </div>
    </div>
  )
}

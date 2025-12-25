import { useState, useEffect, useRef } from 'react'

// simple hook to handle a countdown and automatic phase transitions via callback
export default function useTimer(initialSeconds, onExpire) {
  const [seconds, setSeconds] = useState(initialSeconds || 0)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 0) {
          if (onExpire) onExpire()
          return s
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [onExpire])

  return [seconds, setSeconds]
}

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseTimerOptions {
  startedAt: number
  durationMs: number
  onExpire: () => void
  isActive: boolean
}

export function useTimer({
  startedAt,
  durationMs,
  onExpire,
  isActive,
}: UseTimerOptions) {
  const onExpireRef = useRef(onExpire)
  const hasExpiredRef = useRef(false)

  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, durationMs - (Date.now() - startedAt)),
  )

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    hasExpiredRef.current = false
  }, [startedAt, durationMs])

  useEffect(() => {
    if (!isActive) return

    const tick = () => {
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, durationMs - elapsed)
      setRemainingMs(remaining)

      if (remaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true
        onExpireRef.current()
      }
    }

    tick()
    const intervalId = window.setInterval(tick, 250)
    return () => window.clearInterval(intervalId)
  }, [startedAt, durationMs, isActive])

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [])

  return {
    remainingMs,
    formattedTime: formatTime(remainingMs),
    isExpired: remainingMs <= 0,
  }
}

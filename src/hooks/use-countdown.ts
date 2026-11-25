import { useEffect, useState } from "react"

export function useCountdown(initialSeconds: number) {
  const [endsAt, setEndsAt] = useState(() => Date.now() + initialSeconds * 1000)
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

  useEffect(() => {
    const tick = () =>
      setSecondsLeft(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)))
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [endsAt])

  const restart = (seconds: number) => setEndsAt(Date.now() + seconds * 1000)
  return { secondsLeft, restart }
}
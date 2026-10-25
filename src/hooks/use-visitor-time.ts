import { useEffect, useState } from 'react'

export interface VisitorTime {
  time: string
  /**
   * Manila's calendar day minus the visitor's: 1 means it is already
   * tomorrow for Gean, -1 means it is still yesterday.
   */
  dayDiff: number
}

/** The visitor's local clock, ticking every 30 seconds. */
export function useVisitorTime() {
  const [state, setState] = useState<VisitorTime | null>(null)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const time = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(now)

      const manilaDay = Math.floor((now.getTime() + 8 * 3_600_000) / 86_400_000)
      const localDay = Math.floor((now.getTime() - now.getTimezoneOffset() * 60_000) / 86_400_000)
      setState({ time, dayDiff: manilaDay - localDay })
    }

    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  return state
}

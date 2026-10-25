import { useEffect, useState } from 'react'

/** Live time in Asia/Manila, ticking every 30 seconds. */
export function useManilaTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    const tick = () => setTime(formatter.format(new Date()))
    tick()

    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  return time
}

/** Time-of-day greeting based on Manila's actual hour. */
export function manilaGreeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      hour: 'numeric',
      hour12: false,
    }).format(new Date()),
  )

  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

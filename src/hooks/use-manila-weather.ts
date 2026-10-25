import { useEffect, useState } from 'react'

export interface ManilaWeather {
  temp: number
  code: number
}

/** WMO weather code to a Phosphor icon name. */
export function weatherIcon(code: number): string {
  if (code === 0) return 'sun'
  if (code <= 2) return 'cloud-sun'
  if (code === 3) return 'cloud'
  if (code === 45 || code === 48) return 'cloud-fog'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'cloud-rain'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snowflake'
  if (code >= 95) return 'cloud-lightning'
  return 'cloud-sun'
}

/**
 * Current conditions for Manila via Open-Meteo (no API key needed).
 * Returns null until the fetch resolves, or forever if it fails -
 * the UI simply hides the weather segment in that case.
 */
export function useManilaWeather() {
  const [weather, setWeather] = useState<ManilaWeather | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current_weather=true',
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.current_weather) return
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          code: data.current_weather.weathercode,
        })
      })
      .catch(() => {
        /* weather stays hidden */
      })

    return () => {
      cancelled = true
    }
  }, [])

  return weather
}

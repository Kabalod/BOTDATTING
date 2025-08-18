"use client"

import { useEffect, useMemo, useState } from "react"

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  initDataUnsafe?: unknown
  themeParams?: Record<string, string>
  setHeaderColor?: (colorKeyOrHex: string) => void
  setBackgroundColor?: (colorKeyOrHex: string) => void
  onEvent?: (event: string, cb: () => void) => void
  offEvent?: (event: string, cb: () => void) => void
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [isTelegram, setIsTelegram] = useState(false)
  const [themeParams, setThemeParams] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    const tg = window?.Telegram?.WebApp
    if (!tg) return

    setWebApp(tg)
    setIsTelegram(true)
    try {
      tg.ready()
      tg.expand()
    } catch {}

    if (tg.themeParams) setThemeParams({ ...tg.themeParams })

    const handleThemeChange = () => {
      if (tg.themeParams) setThemeParams({ ...tg.themeParams })
    }

    tg.onEvent?.("themeChanged", handleThemeChange)
    return () => {
      tg.offEvent?.("themeChanged", handleThemeChange)
    }
  }, [])

  const initDataUnsafe = useMemo(() => webApp?.initDataUnsafe, [webApp])

  return { tg: webApp, isTelegram, themeParams, initDataUnsafe }
}



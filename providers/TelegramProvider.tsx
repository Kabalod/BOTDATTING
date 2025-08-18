"use client"

import { ReactNode, useEffect } from "react"
import { useTelegram } from "@/hooks/useTelegram"

export function TelegramProvider({ children }: { children: ReactNode }) {
  const { tg, isTelegram } = useTelegram()

  useEffect(() => {
    if (!tg || !isTelegram) return
    try {
      tg.setHeaderColor?.("secondary_bg_color")
      tg.setBackgroundColor?.("secondary_bg_color")
    } catch {}
  }, [tg, isTelegram])

  return <>{children}</>
}



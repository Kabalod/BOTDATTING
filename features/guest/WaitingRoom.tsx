"use client"

import { useState, useEffect } from "react"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { ArrowLeft, Clock, Users, CheckCircle, Sparkles } from "lucide-react"
import { User } from "./types"

interface WaitingRoomProps {
  user: User
  eventStartTime: Date | null
  onEventStart: () => void
  onBack: () => void
}

export function WaitingRoom({ user, eventStartTime, onEventStart, onBack }: WaitingRoomProps) {
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [participantId, setParticipantId] = useState<string>("")
  const [startLabel, setStartLabel] = useState<string>("")

  useEffect(() => {
    // Generate participant ID
    setParticipantId(`ID-${Math.random().toString(36).substr(2, 6).toUpperCase()}`)
  }, [])

  useEffect(() => {
    if (!eventStartTime) return

    const timer = setInterval(() => {
      const now = new Date()
      const diff = eventStartTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft("Событие началось!")
        clearInterval(timer)
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeLeft(`${days}д ${hours}ч ${minutes}м`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}ч ${minutes}м ${seconds}с`)
      } else {
        setTimeLeft(`${minutes}м ${seconds}с`)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [eventStartTime])

  useEffect(() => {
    if (!eventStartTime) return
    const dateStr = eventStartTime.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
    const timeStr = eventStartTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    setStartLabel(`${dateStr} в ${timeStr}`)
  }, [eventStartTime])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-md mx-auto pt-4 relative z-10">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold ml-2 text-white">Ожидание старта</h1>
        </div>

        <div className="space-y-6">
          {/* Registration Success */}
          <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <span className="font-medium text-white">Регистрация завершена!</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-white/70">Ваш ID:</span>
                  <Badge variant="secondary" className="font-mono bg-white/20 text-white border-0">
                    {participantId}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-white/70">Имя:</span>
                  <span className="text-white font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-white/70">Пол:</span>
                  <span className="text-white font-medium">{user.gender === "male" ? "Мужской" : "Женский"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Countdown Timer */}
          <Card className="border-0 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md shadow-2xl">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-300" />
                  </div>
                  <span className="text-white/90 font-medium">До начала события</span>
                </div>
                <div className="text-4xl font-bold text-white mb-3 tracking-tight">{timeLeft || "Загрузка..."}</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-white/80 text-sm">{startLabel ? `Старт: ${startLabel}` : "Загрузка..."}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Info */}
          <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-full bg-purple-400/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-300" />
                </div>
                Информация о событии
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/70">Формат:</span>
                  <span className="text-white font-medium">Speed Dating</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/70">Время на знакомство:</span>
                  <span className="text-white font-medium">Короткие дейтинги</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/70">Участников ожидается:</span>
                  <span className="text-white font-medium">~20 человек</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10">
                <div className="text-white/90 text-sm leading-relaxed">
                  <div className="font-medium mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    Как это работает:
                  </div>
                  После старта вам будет присвоен номер стола. За ограниченное время познакомьтесь с собеседником, затем
                  оцените встречу. При взаимной симпатии через 24 часа вы получите контакты друг друга.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Start Button */}
          <Button
            onClick={onEventStart}
            className="w-full h-14 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold text-lg shadow-2xl border-0 transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Начать событие (демо)
          </Button>
        </div>
      </div>
    </div>
  )
}

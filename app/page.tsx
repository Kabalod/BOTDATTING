"use client"

import { useState, useEffect } from "react"
import { RegistrationForm } from "@/features/guest/RegistrationForm"
import { WaitingRoom } from "@/features/guest/WaitingRoom"
import { SpeedDatingRoom } from "@/features/guest/SpeedDatingRoom"
import { AdminPanel } from "@/features/admin/AdminPanel"
import { Button } from "@/shared/ui/button"
import { Card } from "@/shared/ui/card"
import { Heart, Users, Clock, Settings, Zap, MessageCircle, ExternalLink } from "lucide-react"
import { AnnaWelcomeChat } from "@/features/welcome/AnnaWelcomeChat"
import { User } from "@/features/guest/types"
import { api } from "@/shared/api"
import { useToast } from "@/shared/ui/use-toast"
import { useTelegram } from "@/shared/hooks/useTelegram"

type AppState = "welcome" | "chat" | "registration" | "waiting" | "dating" | "admin"
type UserRole = "guest" | "admin"

export default function ITSpeedDatingApp() {
  const [appState, setAppState] = useState<AppState>("chat") // Start with chat instead of welcome
  const [userRole, setUserRole] = useState<UserRole>("guest")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [eventStartTime, setEventStartTime] = useState<Date | null>(null)
  const [roundDurationMin, setRoundDurationMin] = useState<number>(7)
  const [eventDate, setEventDate] = useState<string>("2024-08-20")
  const [eventTimeStr, setEventTimeStr] = useState<string>("19:00")
  const { toast } = useToast()
  const { userPhotoUrl } = useTelegram()

  // Compute event start time from settings
  useEffect(() => {
    if (!eventDate || !eventTimeStr) return
    const startTime = new Date(`${eventDate}T${eventTimeStr}:00`)
    setEventStartTime(startTime)
  }, [eventDate, eventTimeStr])

  const handleRegistrationComplete = async (userData: Omit<User, "id">) => {
    try {
      const newUser = await api.registerUser({ ...userData, photo: userPhotoUrl ?? userData.photo })
      setCurrentUser(newUser)
      setAppState("waiting")
    } catch (e: any) {
      toast({ title: "Ошибка регистрации", description: e?.message ?? "Попробуйте ещё раз" })
    }
  }

  const handleEventStart = () => {
    setAppState("dating")
  }

  if (appState === "chat") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-3">
            <div className="pro-it-card p-2 rounded-xl">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm relative">
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="text-white">
              <div className="text-sm font-bold">Pro IT</div>
              <div className="text-xs opacity-80">FEST</div>
            </div>
          </div>

          <Button
            onClick={() => window.open("https://t.me/anna_afonina", "_blank")}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            variant="outline"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Связаться с Анной
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>

        <div className="relative z-10 max-w-md mx-auto pt-20 p-4">
          <AnnaWelcomeChat onComplete={() => setAppState("welcome")} />
        </div>
      </div>
    )
  }

  if (appState === "welcome") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-3">
            <div className="pro-it-card p-2 rounded-xl">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm relative">
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="text-white">
              <div className="text-sm font-bold">Pro IT</div>
              <div className="text-xs opacity-80">FEST</div>
            </div>
          </div>

          <Button
            onClick={() => window.open("https://t.me/anna_afonina", "_blank")}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            variant="outline"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Связаться с Анной
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>

        <div className="relative z-10 max-w-md mx-auto pt-20 p-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="pro-it-card p-6 rounded-3xl">
                <div className="p-4 rounded-2xl bg-white/10">
                  <Heart className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">IT Speed Dating</h1>
            <p className="text-white/80 text-lg">by Анна Афонина</p>
            <div className="mt-2 text-xs text-white/90 font-semibold tracking-wider uppercase">
              Лидер технологических решений
            </div>
          </div>

          <Card className="pro-it-card p-6 mb-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="pro-it-card p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Нетворкинг в IT-сообществе</span>
                  <p className="text-xs text-white/70">Знакомства с профессионалами</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="pro-it-card p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Короткие дейтинги</span>
                  <p className="text-xs text-white/70">Ограниченные по времени встречи</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="pro-it-card p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Взаимные симпатии</span>
                  <p className="text-xs text-white/70">Система оценок встреч</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Button
              onClick={() => setAppState("registration")}
              className="w-full h-14 text-lg bg-white text-blue-600 hover:bg-white/90 font-semibold group relative overflow-hidden shadow-lg"
              size="lg"
            >
              <div className="flex items-center justify-center gap-3 relative z-10">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Вступить
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </Button>

            <Button
              onClick={() => {
                setUserRole("admin")
                setAppState("admin")
              }}
              variant="outline"
              className="w-full h-12 group border-white/30 hover:border-white/50 text-white hover:bg-white/10"
              size="lg"
            >
              <Settings className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-500" />
              Панель администратора
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (appState === "registration") {
    return <RegistrationForm onComplete={handleRegistrationComplete} onBack={() => setAppState("welcome")} />
  }

  if (appState === "waiting") {
    return (
      <WaitingRoom
        user={currentUser!}
        eventStartTime={eventStartTime}
        onEventStart={handleEventStart}
        onBack={() => setAppState("welcome")}
      />
    )
  }

  if (appState === "dating") {
    return <SpeedDatingRoom user={currentUser!} onBack={() => setAppState("waiting")} roundDurationMin={roundDurationMin} />
  }

  if (appState === "admin") {
    return (
      <AdminPanel
        onBack={() => setAppState("welcome")}
        onEventStart={handleEventStart}
        eventDate={eventDate}
        eventTime={eventTimeStr}
        roundDuration={roundDurationMin}
        onEventSettingsChange={({ eventDate: d, eventTime: t, roundDuration: r }) => {
          setEventDate(d)
          setEventTimeStr(t)
          setRoundDurationMin(r)
        }}
      />
    )
  }

  return null
}

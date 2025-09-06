"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RegistrationForm } from "@/features/guest/RegistrationForm"
import { WaitingRoom } from "@/features/guest/WaitingRoom"
import { SpeedDatingRoom } from "@/features/guest/SpeedDatingRoom"
import { Button } from "@/shared/ui/button"
import { Card } from "@/shared/ui/card"
import { Heart, Users, Clock, Settings, Zap, MessageCircle, ExternalLink } from "lucide-react"
import { AnnaWelcomeChat } from "@/features/welcome/AnnaWelcomeChat"
import { User } from "@/features/guest/types"
import { api } from "@/shared/api"
import { useToast } from "@/shared/ui/use-toast"
import { useTelegram } from "@/shared/hooks/useTelegram"

type AppState = "roleSelection" | "welcome" | "chat" | "registration" | "waiting" | "dating" | "admin"

export default function ITSpeedDatingApp() {
  const router = useRouter()
  const [appState, setAppState] = useState<AppState>(() => {
    // Если роль уже сохранена, пропускаем выбор роли
    if (typeof window !== 'undefined' && localStorage.getItem('userRole')) {
      return 'welcome'
    }
    return 'roleSelection'
  }) // Start with role selection or welcome if role exists
  const [userRole, setUserRole] = useState<string>(() => {
    // Загружаем роль из localStorage, если есть
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userRole') || 'guest'
    }
    return 'guest'
  }) // User role for admin access
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
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Попробуйте ещё раз"
      toast({ title: "Ошибка регистрации", description: errorMessage })
    }
  }

  const handleEventStart = () => {
    setAppState("dating")
  }

  if (appState === "roleSelection") {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="pro-it-card p-6 rounded-3xl">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <Settings className="w-16 h-16 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">IT Speed Dating</h1>
              <p className="text-gray-600 text-lg">by Анна Афонина</p>
              <div className="mt-2 text-sm text-gray-500 font-medium">
                Выберите режим тестирования
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => {
                  setUserRole("admin")
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('userRole', 'admin')
                  }
                  setAppState("welcome")
                }}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold group relative overflow-hidden shadow-lg"
                size="lg"
              >
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                  Администратор
                  <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </Button>

              <Button
                onClick={() => {
                  setUserRole("guest")
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('userRole', 'guest')
                  }
                  setAppState("welcome")
                }}
                variant="outline"
                className="w-full h-14 text-lg group border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300"
                size="lg"
              >
                <div className="flex items-center justify-center gap-3">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 text-pink-500" />
                  Пользователь
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 text-yellow-500" />
                </div>
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Админ имеет доступ к полной панели управления</p>
              <p>Пользователь видит только интерфейс участника</p>
            </div>
          </Card>
        </div>
      </div>
    )
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

            {userRole === "admin" && (
              <Button
                onClick={() => router.push('/admin')}
                variant="outline"
                className="w-full h-12 group border-white/30 hover:border-white/50 text-white hover:bg-white/10"
                size="lg"
              >
                <Settings className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-500" />
                Панель администратора
              </Button>
            )}
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
    // Перенаправление на отдельную админ страницу
    if (typeof window !== 'undefined') {
      window.location.href = '/admin'
    }
    return null
  }

  return null
}

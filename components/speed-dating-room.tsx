"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, Heart, X, Users, RotateCcw, CheckCircle } from "lucide-react"

interface User {
  id: string
  name: string
  gender: "male" | "female"
  photo?: string
  description: string
  tableId?: number
}

interface SpeedDatingRoomProps {
  user: User
  onBack: () => void
  roundDurationMin?: number
}

interface Partner {
  id: string
  name: string
  gender: "male" | "female"
  description: string
  photo?: string
}

export function SpeedDatingRoom({ user, onBack, roundDurationMin = 7 }: SpeedDatingRoomProps) {
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds] = useState(5)
  const [timeLeft, setTimeLeft] = useState(roundDurationMin * 60)
  const [isRoundActive, setIsRoundActive] = useState(false)
  const [showVoting, setShowVoting] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [partnerReady, setPartnerReady] = useState(false)
  const [tableNumber] = useState(Math.floor(Math.random() * 10) + 1)
  const [currentPartner, setCurrentPartner] = useState<Partner>({
    id: "partner-1",
    name: "Алексей",
    gender: user.gender === "male" ? "female" : "male", // Opposite gender
    description: "Frontend разработчик, увлекаюсь React и TypeScript. Люблю путешествия и фотографию.",
  })

  const [votes, setVotes] = useState<Record<string, "like" | "dislike">>({})

  // Simulate partner readiness after user clicks ready
  useEffect(() => {
    if (isReady && !partnerReady) {
      const timer = setTimeout(
        () => {
          setPartnerReady(true)
        },
        Math.random() * 3000 + 2000,
      ) // 2-5 seconds delay
      return () => clearTimeout(timer)
    }
  }, [isReady, partnerReady])

  // Start round when both are ready
  useEffect(() => {
    if (isReady && partnerReady && !isRoundActive) {
      setIsRoundActive(true)
    }
  }, [isReady, partnerReady, isRoundActive])

  useEffect(() => {
    if (!isRoundActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRoundActive(false)
          setShowVoting(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRoundActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleReady = () => {
    setIsReady(true)
  }

  const handleVote = (vote: "like" | "dislike") => {
    setVotes({ ...votes, [currentPartner.id]: vote })
    setShowVoting(false)

    if (currentRound < totalRounds) {
      // Next round
      setTimeout(() => {
        setCurrentRound(currentRound + 1)
        setTimeLeft(roundDurationMin * 60)
        setIsReady(false)
        setPartnerReady(false)
        setIsRoundActive(false)
        // Simulate new partner
        setCurrentPartner({
          id: `partner-${currentRound + 1}`,
          name: ["Мария", "Дмитрий", "Анна", "Сергей"][currentRound % 4],
          gender: user.gender === "male" ? "female" : "male",
          description: [
            "UX/UI дизайнер, работаю в стартапе. Обожаю современное искусство и йогу.",
            "Backend разработчик на Python. Увлекаюсь машинным обучением и играю на гитаре.",
            "Product Manager в IT-компании. Люблю книги, театр и активный отдых.",
            "DevOps инженер, работаю с облачными технологиями. Занимаюсь скалолазанием.",
          ][currentRound % 4],
        })
      }, 1500)
    } else {
      // Event finished
      setTimeout(() => {
        alert("Спасибо за участие! Результаты матчинга придут в течение 24 часов.")
        onBack()
      }, 1500)
    }
  }

  const totalSeconds = roundDurationMin * 60
  const progressPercentage = ((totalSeconds - timeLeft) / totalSeconds) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-4">
      <div className="max-w-md mx-auto pt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold ml-2 text-white">Speed Dating</h1>
          </div>
          <Badge className="bg-white text-blue-600 font-semibold">Стол {tableNumber}</Badge>
        </div>

        <div className="space-y-4">
          {/* Round Info */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-800">
                    Раунд {currentRound} из {totalRounds}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="font-mono text-lg font-bold text-blue-600">{formatTime(timeLeft)}</span>
                </div>
              </div>
              {isRoundActive && <Progress value={progressPercentage} className="h-2" />}
            </CardContent>
          </Card>

          {/* Partner Card */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">{currentPartner.name[0]}</span>
                </div>
                <div>
                  <div className="text-gray-800">{currentPartner.name}</div>
                  <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                    {currentPartner.gender === "male" ? "Мужской" : "Женский"}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{currentPartner.description}</p>
            </CardContent>
          </Card>

          {/* Ready Status */}
          {!isRoundActive && !showVoting && (
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isReady ? "bg-green-500" : "bg-gray-300"}`}></div>
                      <span className="text-sm text-gray-700">Вы</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${partnerReady ? "bg-green-500" : "bg-gray-300"}`}></div>
                      <span className="text-sm text-gray-700">{currentPartner.name}</span>
                    </div>
                  </div>

                  {!isReady ? (
                    <Button onClick={handleReady} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Готов
                    </Button>
                  ) : !partnerReady ? (
                    <div className="text-gray-600">
                      <RotateCcw className="w-6 h-6 mx-auto mb-2 animate-spin text-blue-600" />
                      Ожидаем готовности собеседника...
                    </div>
                  ) : (
                    <div className="text-green-600 font-medium">
                      <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                      Начинаем знакомство!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conversation Tips */}
          {isRoundActive && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-xl">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-3 text-blue-800 flex items-center gap-2">💡 Темы для разговора:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Чем занимаетесь в IT?</li>
                  <li>• Любимые технологии и проекты</li>
                  <li>• Хобби и интересы вне работы</li>
                  <li>• Планы на будущее</li>
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Voting Modal */}
          {showVoting && (
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-gray-800">Оцените знакомство</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 mb-6">Хотели бы продолжить общение с {currentPartner.name}?</p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleVote("dislike")}
                    variant="outline"
                    className="flex-1 h-12 border-gray-300 hover:bg-gray-50"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Приятное знакомство
                  </Button>
                  <Button onClick={() => handleVote("like")} className="flex-1 h-12 bg-pink-500 hover:bg-pink-600">
                    <Heart className="w-5 h-5 mr-2" />
                    Хочу встретиться
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

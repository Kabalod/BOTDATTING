"use client"

import { useState, useEffect } from "react"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Badge } from "@/shared/ui/badge"
import {
  ArrowLeft,
  Users,
  Clock,
  Play,
  Settings,
  UserCheck,
  Calendar,
  Timer,
  Bell,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
} from "lucide-react"
import { Participant } from "./types"
import { api } from "@/shared/api"

interface AdminPanelProps {
  onBack: () => void
  onEventStart: () => void
  eventDate: string
  eventTime: string
  roundDuration: number
  onEventSettingsChange: (settings: { eventDate: string; eventTime: string; roundDuration: number }) => void
}

export function AdminPanel({ onBack, onEventStart, eventDate, eventTime, roundDuration, onEventSettingsChange }: AdminPanelProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [nameFilter, setNameFilter] = useState("")
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all")
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "unpaid">("all")
  const [activeTab, setActiveTab] = useState<"registered" | "present">("registered")

  const [registeredParticipants, setRegisteredParticipants] = useState<Participant[]>([])

  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true)
      const participants = await api.getParticipants()
      setRegisteredParticipants(participants)
      setIsLoading(false)
    }
    fetchParticipants()
  }, [])

  const presentParticipants = registeredParticipants.filter((p) => p.ready)

  const getFilteredParticipants = (participants: Participant[]) => {
    return participants.filter((participant) => {
      const nameMatch = participant.name.toLowerCase().includes(nameFilter.toLowerCase())
      const genderMatch = genderFilter === "all" || participant.gender === genderFilter
      const paymentMatch =
        paymentFilter === "all" ||
        (paymentFilter === "paid" && participant.paid) ||
        (paymentFilter === "unpaid" && !participant.paid)

      return nameMatch && genderMatch && paymentMatch
    })
  }

  const currentParticipants = activeTab === "registered" ? registeredParticipants : presentParticipants
  const filteredParticipants = getFilteredParticipants(currentParticipants)
  const maleCount = presentParticipants.filter((p) => p.gender === "male").length
  const femaleCount = presentParticipants.filter((p) => p.gender === "female").length
  const totalTables = Math.floor(Math.min(maleCount, femaleCount))

  const handleDeleteParticipant = async (id: string) => {
    const success = await api.deleteParticipant(id)
    if (success) {
      setRegisteredParticipants((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleToggleReady = async (id: string) => {
    const participant = registeredParticipants.find((p) => p.id === id)
    if (!participant) return

    const updatedParticipant = await api.updateParticipant(id, { ready: !participant.ready })
    if (updatedParticipant) {
      setRegisteredParticipants((prev) => prev.map((p) => (p.id === id ? updatedParticipant : p)))
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600"></div>

      <div className="relative z-10 max-w-md mx-auto pt-4 p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 backdrop-blur-sm rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-white ml-2 drop-shadow-lg">Панель администратора</h1>
        </div>

        <div className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-lg font-semibold">Настройки события</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Дата
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => onEventSettingsChange({ eventDate: e.target.value, eventTime, roundDuration })}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Время
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={eventTime}
                    onChange={(e) => onEventSettingsChange({ eventDate, eventTime: e.target.value, roundDuration })}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Длительность раунда (минуты)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={roundDuration}
                  onChange={(e) => onEventSettingsChange({ eventDate, eventTime, roundDuration: Number(e.target.value) })}
                  min="1"
                  max="15"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-lg font-semibold">Статистика пришедших</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{maleCount}</div>
                  <div className="text-sm font-medium text-gray-600">Мужчин</div>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-2xl">
                  <div className="text-3xl font-bold text-pink-600 mb-1">{femaleCount}</div>
                  <div className="text-sm font-medium text-gray-600">Женщин</div>
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white">
                <div className="text-2xl font-bold mb-1">{totalTables} столов</div>
                <div className="text-sm opacity-90">
                  {presentParticipants.length - totalTables * 2 > 0 &&
                    `${presentParticipants.length - totalTables * 2} участников без пары`}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-lg font-semibold">Управление участниками</span>
                </CardTitle>
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Табы */}
              <div className="flex bg-gray-100 rounded-xl p-1 mt-4">
                <button
                  onClick={() => setActiveTab("registered")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "registered"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Заявленные ({registeredParticipants.length})
                </button>
                <button
                  onClick={() => setActiveTab("present")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "present" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Пришедшие ({presentParticipants.length})
                </button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Фильтры */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Поиск по имени..."
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value as any)}
                    className="flex-1 p-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">Все полы</option>
                    <option value="male">Мужчины</option>
                    <option value="female">Женщины</option>
                  </select>

                  {activeTab === "registered" && (
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value as any)}
                      className="flex-1 p-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="all">Все платежи</option>
                      <option value="paid">Оплачено</option>
                      <option value="unpaid">Не оплачено</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Список участников */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          participant.gender === "male" ? "bg-blue-500" : "bg-pink-500"
                        }`}
                      >
                        {participant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 flex items-center gap-2">
                          {participant.name}
                          {participant.ready && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{participant.registeredAt.toLocaleTimeString()}</span>
                          {activeTab === "registered" && (
                            <Badge variant={participant.paid ? "default" : "destructive"} className="text-xs">
                              {participant.paid ? "Оплачено" : "Не оплачено"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={participant.gender === "male" ? "default" : "secondary"}
                        className={`${
                          participant.gender === "male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                        } font-semibold`}
                      >
                        {participant.gender === "male" ? "М" : "Ж"}
                      </Badge>

                      {activeTab === "registered" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleReady(participant.id)}
                            className={`p-1 h-8 w-8 ${
                              participant.ready
                                ? "text-green-600 hover:bg-green-100"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1 h-8 w-8 text-blue-600 hover:bg-blue-100">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteParticipant(participant.id)}
                            className="p-1 h-8 w-8 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {filteredParticipants.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Участники не найдены</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={onEventStart}
              className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              size="lg"
            >
              <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Начать событие ({presentParticipants.length} участников)
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 bg-white/90 hover:bg-white border-white/50 text-gray-700 hover:text-gray-800 rounded-2xl backdrop-blur-sm shadow-lg group"
            >
              <Bell className="w-4 h-4 mr-3 group-hover:animate-pulse" />
              Отправить уведомления участникам
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

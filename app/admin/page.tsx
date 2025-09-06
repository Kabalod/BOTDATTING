"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Badge } from "@/shared/ui/badge"
import { useToast } from "@/shared/ui/use-toast"
import {
  ArrowLeft,
  Users,
  Calendar,
  Edit,
  Play,
  Plus,
} from "lucide-react"

type AdminView = "events" | "eventDetail" | "eventEdit"

export default function AdminPage() {
  const router = useRouter()
  const [currentView, setCurrentView] = useState<AdminView>("events")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [participants, setParticipants] = useState<any[]>([])

  // Для редактирования события
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    eventDate: "",
    eventTime: "",
    maxParticipants: 0,
    malePercentage: 50,
    femalePercentage: 50,
    roundDuration: 7
  })

  const { toast } = useToast()

  // Загрузка предстоящих событий
  const loadEvents = async () => {
    try {
      const response = await fetch('/api/events?activeOnly=true')
      const eventsData = await response.json()
      setEvents(eventsData)
    } catch (error) {
      console.error('Failed to load events:', error)
      toast({ title: "Ошибка загрузки", description: "Не удалось загрузить события", variant: "destructive" })
    }
  }

  // Загрузка участников события
  const loadEventParticipants = async (eventId: string) => {
    try {
      const response = await fetch(`/api/participants?eventId=${eventId}`)
      const participantsData = await response.json()
      setParticipants(participantsData)
    } catch (error) {
      console.error('Failed to load participants:', error)
      toast({ title: "Ошибка загрузки", description: "Не удалось загрузить участников", variant: "destructive" })
    }
  }

  // Валидация даты - нельзя ставить на прошлое
  const validateEventDateTime = (date: string, time: string): boolean => {
    const eventDateTime = new Date(`${date}T${time}`)
    const now = new Date()
    return eventDateTime > now
  }

  // Обновление события
  const updateEvent = async (eventId: string, updates: any) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await loadEvents() // Перезагрузить список событий
        toast({ title: "Событие обновлено", description: "Изменения сохранены" })
        return true
      } else {
        throw new Error('Failed to update event')
      }
    } catch (error) {
      toast({ title: "Ошибка обновления", description: "Не удалось обновить событие", variant: "destructive" })
      return false
    }
  }

  // Запуск события
  const startEvent = async (eventId: string) => {
    try {
      toast({ title: "Событие запущено", description: "Дейтинг начался для всех участников!" })
    } catch (error) {
      toast({ title: "Ошибка запуска", description: "Не удалось запустить событие", variant: "destructive" })
    }
  }

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadEvents()
  }, [])

  // Загрузка участников при выборе события
  useEffect(() => {
    if (selectedEvent) {
      loadEventParticipants(selectedEvent.id)
    }
  }, [selectedEvent])

  // Рендер главного меню с событиями
  const renderEventsList = () => (
    <div className="space-y-4">
      <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-800">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-lg font-semibold">Предстоящие события</span>
            </div>
            <Button
              onClick={() => {
                // Переход к созданию нового события
                const newEvent = {
                  id: 'new',
                  title: '',
                  city: 'SAINT_PETERSBURG',
                  eventDate: new Date().toISOString().split('T')[0],
                  eventTime: '19:00',
                  maxParticipants: 20,
                  malePercentage: 50,
                  femalePercentage: 50,
                  roundDuration: 7,
                  isActive: true
                }
                setEditingEvent(newEvent)
                setEditForm({
                  eventDate: newEvent.eventDate,
                  eventTime: newEvent.eventTime,
                  maxParticipants: newEvent.maxParticipants,
                  malePercentage: newEvent.malePercentage,
                  femalePercentage: newEvent.femalePercentage,
                  roundDuration: newEvent.roundDuration
                })
                setCurrentView("eventEdit")
              }}
              className="bg-blue-500 hover:bg-blue-600 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать событие
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Нет предстоящих событий</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedEvent(event)
                    setCurrentView("eventDetail")
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">
                        {event.title || `IT Speed Dating ${event.city}`}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {event.eventDate} в {event.eventTime}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Город: {event.city}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">
                        Макс: {event.maxParticipants}
                      </div>
                      <div className="text-xs text-gray-500">
                        М: {Math.floor(event.maxParticipants * event.malePercentage / 100)} |
                        Ж: {Math.floor(event.maxParticipants * event.femalePercentage / 100)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // Рендер детального вида события
  const renderEventDetail = () => (
    <div className="space-y-4">
      {/* Информация о событии */}
      <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-lg font-semibold">{selectedEvent.title || `IT Speed Dating ${selectedEvent.city}`}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{selectedEvent.eventDate}</div>
              <div className="text-sm text-gray-600">Дата</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{selectedEvent.eventTime}</div>
              <div className="text-sm text-gray-600">Время</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Город:</span>
              <span className="font-medium">{selectedEvent.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Максимум участников:</span>
              <span className="font-medium">{selectedEvent.maxParticipants}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Мужчин:</span>
              <span className="font-medium">{Math.floor(selectedEvent.maxParticipants * selectedEvent.malePercentage / 100)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Женщин:</span>
              <span className="font-medium">{Math.floor(selectedEvent.maxParticipants * selectedEvent.femalePercentage / 100)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Длительность раунда:</span>
              <span className="font-medium">{selectedEvent.roundDuration} мин</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Участники */}
      <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-green-100 rounded-xl">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-lg font-semibold">Участники ({participants.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {participants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Нет зарегистрированных участников</p>
            </div>
          ) : (
            <div className="space-y-3">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                      participant.gender === "male" ? "bg-blue-500" : "bg-pink-500"
                    }`}>
                      {participant.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{participant.name}</div>
                      <div className="text-xs text-gray-500">{participant.registeredAt?.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={participant.paid ? "default" : "destructive"} className="text-xs">
                      {participant.paid ? "Оплачено" : "Не оплачено"}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {participant.gender === "male" ? "М" : "Ж"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Кнопки действий */}
      <div className="space-y-3">
        <Button
          onClick={() => {
            setEditingEvent(selectedEvent)
            setEditForm({
              eventDate: selectedEvent.eventDate,
              eventTime: selectedEvent.eventTime,
              maxParticipants: selectedEvent.maxParticipants,
              malePercentage: selectedEvent.malePercentage,
              femalePercentage: selectedEvent.femalePercentage,
              roundDuration: selectedEvent.roundDuration
            })
            setCurrentView("eventEdit")
          }}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 rounded-xl"
        >
          <Edit className="w-4 h-4 mr-2" />
          Редактировать событие
        </Button>

        <Button
          onClick={() => startEvent(selectedEvent.id)}
          className="w-full h-12 bg-green-500 hover:bg-green-600 rounded-xl"
          disabled={participants.length === 0}
        >
          <Play className="w-4 h-4 mr-2" />
          Запустить событие ({participants.length} участников)
        </Button>
      </div>
    </div>
  )

  // Рендер формы редактирования события
  const renderEventEdit = () => (
    <div className="space-y-4">
      <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-orange-100 rounded-xl">
              <Edit className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-lg font-semibold">
              {editingEvent?.id === 'new' ? 'Создание события' : 'Редактирование события'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Дата</Label>
              <Input
                type="date"
                value={editForm.eventDate}
                onChange={(e) => setEditForm(prev => ({ ...prev, eventDate: e.target.value }))}
                className="border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Время</Label>
              <Input
                type="time"
                value={editForm.eventTime}
                onChange={(e) => setEditForm(prev => ({ ...prev, eventTime: e.target.value }))}
                className="border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Максимум участников</Label>
            <Input
              type="number"
              value={editForm.maxParticipants}
              onChange={(e) => setEditForm(prev => ({ ...prev, maxParticipants: Number(e.target.value) }))}
              min="2"
              max="100"
              className="border-gray-200 focus:border-blue-500 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Баланс мужчин (%)</Label>
            <Input
              type="number"
              value={editForm.malePercentage}
              onChange={(e) => setEditForm(prev => ({
                ...prev,
                malePercentage: Number(e.target.value),
                femalePercentage: 100 - Number(e.target.value)
              }))}
              min="0"
              max="100"
              className="border-gray-200 focus:border-blue-500 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Баланс женщин (%)</Label>
            <Input
              type="number"
              value={editForm.femalePercentage}
              readOnly
              className="border-gray-200 bg-gray-50 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Длительность раунда (минуты)</Label>
            <Input
              type="number"
              value={editForm.roundDuration}
              onChange={(e) => setEditForm(prev => ({ ...prev, roundDuration: Number(e.target.value) }))}
              min="1"
              max="15"
              className="border-gray-200 focus:border-blue-500 rounded-xl"
            />
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              onClick={async () => {
                // Валидация даты
                if (!validateEventDateTime(editForm.eventDate, editForm.eventTime)) {
                  toast({
                    title: "Некорректная дата",
                    description: "Дата и время не могут быть в прошлом",
                    variant: "destructive"
                  })
                  return
                }

                if (editingEvent.id === 'new') {
                  // Создание нового события
                  try {
                    const response = await fetch('/api/events', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title: `IT Speed Dating ${editForm.eventDate}`,
                        city: 'SAINT_PETERSBURG',
                        eventDate: editForm.eventDate,
                        eventTime: editForm.eventTime,
                        roundDuration: editForm.roundDuration,
                        maxParticipants: editForm.maxParticipants,
                        malePercentage: editForm.malePercentage,
                        femalePercentage: editForm.femalePercentage,
                        isActive: true
                      })
                    })


                    if (response.ok) {
                      await loadEvents()
                      toast({ title: "Событие создано", description: "Новое событие успешно создано" })
                      setCurrentView("events")
                    } else {
                      const errorText = await response.text()
                      console.error('API Error:', response.status, errorText)
                      toast({
                        title: "Ошибка создания",
                        description: `API вернул ошибку ${response.status}: ${errorText}`,
                        variant: "destructive"
                      })
                      return
                    }
                  } catch (error) {
                    toast({ title: "Ошибка создания", description: "Не удалось создать событие", variant: "destructive" })
                  }
                } else {
                  // Обновление существующего события
                  const success = await updateEvent(editingEvent.id, editForm)
                  if (success) {
                    setCurrentView("eventDetail")
                    setSelectedEvent({ ...selectedEvent, ...editForm })
                  }
                }
              }}
              className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-xl"
            >
              {editingEvent?.id === 'new' ? 'Создать событие' : 'Сохранить изменения'}
            </Button>
            <Button
              onClick={() => setCurrentView("eventDetail")}
              variant="outline"
              className="flex-1 border-gray-300 hover:border-gray-400 rounded-xl"
            >
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600"></div>

      <div className="relative z-10 max-w-md mx-auto pt-4 p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={currentView === "events" ? () => router.push('/') : () => setCurrentView("events")}
            className="text-white hover:bg-white/20 backdrop-blur-sm rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-white ml-2 drop-shadow-lg">
            {currentView === "events" && "Панель администратора"}
            {currentView === "eventDetail" && "Управление событием"}
            {currentView === "eventEdit" && "Редактирование события"}
          </h1>
        </div>

        <div className="space-y-4">
          {currentView === "events" && renderEventsList()}

          {currentView === "eventDetail" && selectedEvent && renderEventDetail()}

          {currentView === "eventEdit" && editingEvent && renderEventEdit()}
        </div>
      </div>
    </div>
  )
}

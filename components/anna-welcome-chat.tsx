"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { CheckCheck } from "lucide-react"

interface Message {
  id: number
  text: string
  timestamp: string
  isTyping?: boolean
}

interface AnnaWelcomeChatProps {
  onComplete?: () => void
}

export function AnnaWelcomeChat({ onComplete }: AnnaWelcomeChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const welcomeMessages = [
    "Привет! Я Анна Афонина 👋",
    "Добро пожаловать на IT Speed Dating!",
    "Сегодня вас ждут интересные знакомства с коллегами по IT-сфере",
    "За короткое время вы сможете узнать друг друга и найти новые связи",
    "Готовы к нетворкингу? Заполните анкету и ждите старта! 🚀",
  ]

  useEffect(() => {
    if (currentMessageIndex < welcomeMessages.length) {
      setIsTyping(true)

      const typingTimer = setTimeout(
        () => {
          setIsTyping(false)

          const messageTimer = setTimeout(() => {
            const newMessage: Message = {
              id: currentMessageIndex,
              text: welcomeMessages[currentMessageIndex],
              timestamp: new Date().toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }

            setMessages((prev) => [...prev, newMessage])
            setCurrentMessageIndex((prev) => prev + 1)
          }, 300)

          return () => clearTimeout(messageTimer)
        },
        currentMessageIndex === 0 ? 1000 : 1500,
      )

      return () => clearTimeout(typingTimer)
    } else if (currentMessageIndex === welcomeMessages.length && onComplete) {
      const completeTimer = setTimeout(() => {
        onComplete()
      }, 2000)

      return () => clearTimeout(completeTimer)
    }
  }, [currentMessageIndex, welcomeMessages, onComplete])

  return (
    <Card className="pro-it-card p-4 mb-6">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/20">
        <div className="relative">
          <img
            src="/images/anna-avatar.jpg"
            alt="Анна Афонина"
            className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <div className="text-white font-medium text-sm">Анна Афонина</div>
          <div className="text-white/60 text-xs">онлайн</div>
        </div>
      </div>

      <div className="space-y-3">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className="flex gap-3 animate-in slide-in-from-left-2 duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <img
              src="/images/anna-avatar.jpg"
              alt="Анна"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
            />
            <div className="flex-1">
              <div className="bg-white/10 rounded-2xl rounded-tl-md px-4 py-2 max-w-xs backdrop-blur-sm">
                <p className="text-white text-sm leading-relaxed">{message.text}</p>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-white/50 text-xs">{message.timestamp}</span>
                <CheckCheck className="w-3 h-3 text-blue-400" />
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 animate-in slide-in-from-left-2 duration-300">
            <img
              src="/images/anna-avatar.jpg"
              alt="Анна"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
            />
            <div className="bg-white/10 rounded-2xl rounded-tl-md px-4 py-2 backdrop-blur-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

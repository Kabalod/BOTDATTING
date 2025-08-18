"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Upload, User } from "lucide-react"

interface RegistrationFormProps {
  onComplete: (userData: {
    name: string
    gender: "male" | "female"
    photo?: string
    description: string
  }) => void
  onBack: () => void
}

export function RegistrationForm({ onComplete, onBack }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "" as "male" | "female" | "",
    photo: "",
    description: "",
  })

  const [step, setStep] = useState(1)
  const totalSteps = 4

  const handleSubmit = () => {
    if (formData.name && formData.gender && formData.description) {
      onComplete({
        name: formData.name,
        gender: formData.gender,
        photo: formData.photo,
        description: formData.description,
      })
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== ""
      case 2:
        return formData.gender !== ""
      case 3:
        return true // Photo is optional
      case 4:
        return formData.description.trim() !== ""
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-md mx-auto pt-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold ml-2">Регистрация</h1>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>
              Шаг {step} из {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {step === 1 && "Как вас зовут?"}
              {step === 2 && "Укажите ваш пол"}
              {step === 3 && "Добавьте фотографию"}
              {step === 4 && "Расскажите о себе"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  placeholder="Введите ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12"
                />
              </div>
            )}

            {step === 2 && (
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value as "male" | "female" })}
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="flex-1 cursor-pointer">
                    Мужской
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="flex-1 cursor-pointer">
                    Женский
                  </Label>
                </div>
              </RadioGroup>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Загрузите фотографию (необязательно)</p>
                  <Button variant="outline" size="sm">
                    Выбрать файл
                  </Button>
                </div>
                {formData.photo && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    Фотография загружена
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-2">
                <Label htmlFor="description">Краткое описание</Label>
                <Textarea
                  id="description"
                  placeholder="Расскажите немного о себе, ваших интересах и том, что ищете..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">{formData.description.length}/200 символов</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  Назад
                </Button>
              )}

              {step < totalSteps ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="flex-1">
                  Далее
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canProceed()} className="flex-1">
                  Завершить регистрацию
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

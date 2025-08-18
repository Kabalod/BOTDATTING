import { User } from "@/features/guest/types"
import { Participant } from "@/features/admin/types"

// --- Mock Database ---
let mockUsers: User[] = [
  { id: "1", name: "Алексей Петров", gender: "male", description: "Team Lead", tableId: 1 },
  { id: "2", name: "Мария Иванова", gender: "female", description: "Frontend Developer", tableId: 1 },
  { id: "3", name: "Дмитрий Сидоров", gender: "male", description: "Backend Developer", tableId: 2 },
]

let mockParticipants: Participant[] = [
  { id: "1", name: "Алексей Петров", gender: "male", registeredAt: new Date(), paid: true, ready: true },
  { id: "2", name: "Мария Иванова", gender: "female", registeredAt: new Date(), paid: true, ready: true },
  { id: "3", name: "Дмитрий Сидоров", gender: "male", registeredAt: new Date(), paid: false, ready: false },
  { id: "4", name: "Анна Козлова", gender: "female", registeredAt: new Date(), paid: true, ready: false },
  { id: "5", name: "Сергей Морозов", gender: "male", registeredAt: new Date(), paid: true, ready: true },
]

// --- Mock API ---

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  // --- Guest Endpoints ---
  registerUser: async (userData: Omit<User, "id">): Promise<User> => {
    await delay(500)
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
    }
    mockUsers.push(newUser)
    console.log("[Mock API] Registered new user:", newUser)
    return newUser
  },

  getUser: async (userId: string): Promise<User | null> => {
    await delay(300)
    const user = mockUsers.find((u) => u.id === userId)
    console.log("[Mock API] Get user:", user)
    return user || null
  },

  // --- Admin Endpoints ---
  getParticipants: async (): Promise<Participant[]> => {
    await delay(700)
    console.log("[Mock API] Get all participants:", mockParticipants)
    return [...mockParticipants]
  },

  updateParticipant: async (
    participantId: string,
    updates: Partial<Participant>
  ): Promise<Participant | null> => {
    await delay(400)
    let updatedParticipant: Participant | null = null
    mockParticipants = mockParticipants.map((p) => {
      if (p.id === participantId) {
        updatedParticipant = { ...p, ...updates }
        return updatedParticipant
      }
      return p
    })
    console.log("[Mock API] Updated participant:", updatedParticipant)
    return updatedParticipant
  },

  deleteParticipant: async (participantId: string): Promise<boolean> => {
    await delay(600)
    const initialLength = mockParticipants.length
    mockParticipants = mockParticipants.filter((p) => p.id !== participantId)
    const success = mockParticipants.length < initialLength
    console.log(`[Mock API] Deleted participant ${participantId}:`, success)
    return success
  },
}

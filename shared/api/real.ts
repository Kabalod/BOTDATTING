import { User } from "@/features/guest/types"
import { Participant } from "@/features/admin/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4090/api"

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!res.ok) {
    // In a real app, you'd handle errors more gracefully
    throw new Error(`API call failed: ${res.statusText}`)
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return null as T
  }

  return res.json()
}

export const realApi = {
  // --- Guest Endpoints ---
  registerUser: (userData: Omit<User, "id">): Promise<User> => {
    // Backend endpoint: POST /api/participants
    const payload = {
      bio: userData.description,
      gender: userData.gender === "male" ? "MALE" : "FEMALE",
    }
    return fetcher("/participants", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((p: any) => {
      const mapped: User = {
        id: String(p.id),
        name: userData.name,
        gender: userData.gender,
        photo: userData.photo,
        description: userData.description,
        tableId: undefined,
      }
      return mapped
    })
  },

  getUser: (userId: string): Promise<User | null> => {
    return fetcher(`/users/${userId}`)
  },

  // --- Admin Endpoints ---
  getParticipants: (): Promise<Participant[]> => {
    return fetcher("/participants").then((list: any[]) =>
      list.map((p) => ({
        id: String(p.id),
        name: p.name ?? "Участник",
        gender: p.gender === "MALE" ? "male" : "female",
        registeredAt: new Date(p.registeredAt ?? p.createdAt ?? Date.now()),
        paid: Boolean(p.paid),
        ready: Boolean(p.ready),
      }))
    )
  },

  updateParticipant: (
    participantId: string,
    updates: Partial<Participant>
  ): Promise<Participant | null> => {
    const payload: any = {}
    if (typeof updates.ready === "boolean") payload.ready = updates.ready
    if (typeof updates.paid === "boolean") payload.paid = updates.paid
    return fetcher(`/participants/${participantId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }).then((p: any) =>
      p
        ? {
            id: String(p.id),
            name: p.name ?? "Участник",
            gender: p.gender === "MALE" ? "male" : "female",
            registeredAt: new Date(p.registeredAt ?? p.createdAt ?? Date.now()),
            paid: Boolean(p.paid),
            ready: Boolean(p.ready),
          }
        : null
    )
  },

  deleteParticipant: (participantId: string): Promise<boolean> => {
    return fetcher(`/participants/${participantId}`, {
      method: "DELETE",
    }).then((res) => (res === null ? true : Boolean(res)))
  },
}

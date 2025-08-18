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
    return fetcher("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  getUser: (userId: string): Promise<User | null> => {
    return fetcher(`/users/${userId}`)
  },

  // --- Admin Endpoints ---
  getParticipants: (): Promise<Participant[]> => {
    return fetcher("/participants")
  },

  updateParticipant: (
    participantId: string,
    updates: Partial<Participant>
  ): Promise<Participant | null> => {
    return fetcher(`/participants/${participantId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  },

  deleteParticipant: (participantId: string): Promise<boolean> => {
    return fetcher(`/participants/${participantId}`, {
      method: "DELETE",
    }).then(() => true)
  },
}

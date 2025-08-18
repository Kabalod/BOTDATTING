export interface Participant {
  id: string
  name: string
  gender: "male" | "female"
  registeredAt: Date
  paid: boolean
  ready?: boolean
}

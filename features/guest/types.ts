export interface User {
  id: string
  name: string
  gender: "male" | "female"
  photo?: string
  description: string
  tableId?: number
}

export interface Partner {
  id: string
  name: string
  gender: "male" | "female"
  description: string
  photo?: string
}

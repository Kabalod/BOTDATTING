import { mockApi } from "./mock"
import { realApi } from "./real"

// In a real application, you might use a condition to switch between mock and real APIs:
const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API === "true"

export const api = useMock ? mockApi : realApi

export interface ReadingSession {
  id: number
  startPage: number
  endPage: number
  date: string
  note: string | null
  createdAt: string
  updatedAt: string | null
}

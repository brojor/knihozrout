export enum ReadingStateType {
  WANT_TO_READ = 'WANT_TO_READ',
  CURRENTLY_READING = 'CURRENTLY_READING',
  READ = 'READ',
  DROPPED = 'DROPPED',
}

export interface ReadingState {
  id: number
  state: ReadingStateType
  startDate: string | null
  endDate: string | null
  rating: number | null
  note: string | null
  createdAt: string
  updatedAt: string | null
}

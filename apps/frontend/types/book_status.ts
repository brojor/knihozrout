export enum BookStatusType {
  OWNED = 'OWNED',
  BORROWED = 'BORROWED',
  WISHLIST = 'WISHLIST',
}

export interface BookStatus {
  id: number
  status: BookStatusType
  note: string | null
  createdAt: string
  updatedAt: string | null
}

export interface BookLoan {
  id: number
  loanDate: string
  returnDate: string | null
  note: string | null
  createdAt: string
  updatedAt: string | null
}

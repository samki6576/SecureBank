export interface CardData {
    id: string
    type: 'debit' | 'credit'
    number: string
    holderName: string
    expiryDate: string
    cvv: string
    balance: number
    cardProvider: string
    isActive: boolean
    spendingLimit?: number
    usedAmount?: number
    creditLimit?: number
  }
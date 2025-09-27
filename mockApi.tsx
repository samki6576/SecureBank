interface CardData {
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

export async function fetchMockCards(): Promise<CardData[]> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return [
    {
      id: '1',
      type: 'debit',
      number: '**** **** **** 1234',
      holderName: 'John Doe',
      expiryDate: '12/25',
      cvv: '***',
      balance: 2500.75,
      cardProvider: 'Visa',
      isActive: true,
      spendingLimit: 5000,
      usedAmount: 2500.75
    },
    {
      id: '2',
      type: 'credit',
      number: '**** **** **** 5678',
      holderName: 'John Doe',
      expiryDate: '10/26',
      cvv: '***',
      balance: -1500.50,
      cardProvider: 'Mastercard',
      isActive: true,
      creditLimit: 10000,
      usedAmount: 1500.50
    }
  ]
}
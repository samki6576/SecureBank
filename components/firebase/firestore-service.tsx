import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/firebase/firebasecon'

export interface User {
  id?: string
  name: string
  email: string
  phone: string
  balance: number
  kycVerified: boolean
  createdAt: Timestamp
}

export interface Transaction {
  id?: string
  userId: string
  type: 'send' | 'receive' | 'deposit' | 'withdraw'
  amount: number
  recipient?: string
  description: string
  category: string
  createdAt: Timestamp
}

export const firestoreService = {
  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: Timestamp.now()
    })
    return docRef.id
  },

  async getUser(userId: string): Promise<User | null> {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User
    }
    return null
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const q = query(collection(db, 'users'), where('email', '==', email))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as User
    }
    return null
  },

  async updateUserBalance(userId: string, newBalance: number): Promise<void> {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, { balance: newBalance })
  },

  // Transaction operations
  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      createdAt: Timestamp.now()
    })
    return docRef.id
  },

  async getUserTransactions(userId: string, limitCount: number = 10): Promise<Transaction[]> {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[]
  },

  async getAllTransactions(userId: string): Promise<Transaction[]> {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[]
  }
}


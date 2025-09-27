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

// Mock Users
export const fetchMockUsers = async () => {
  const mockUsers = [
    {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      avatar: "JD"
    },
    {
      firstname: "Sarah",
      lastname: "Wilson",
      email: "sarah.wilson@example.com",
      phone: "+1 (555) 987-6543",
      avatar: "SW"
    },
    {
      firstname: "Mike",
      lastname: "Johnson",
      email: "mike.johnson@example.com",
      phone: "+1 (555) 456-7890",
      avatar: "MJ"
    },
    {
      firstname: "Emily",
      lastname: "Davis",
      email: "emily.davis@example.com",
      phone: "+1 (555) 321-0987",
      avatar: "ED"
    },
    {
      firstname: "David",
      lastname: "Brown",
      email: "david.brown@example.com",
      phone: "+1 (555) 654-3210",
      avatar: "DB"
    }
  ];
  return mockUsers;
};

// Mock Transactions
export const fetchMockTransactions = async () => {
  const transactions = [
    {
      id: "1",
      type: "send",
      amount: 150.00,
      recipient: "Sarah Wilson",
      description: "Coffee shop payment",
      category: "Food & Dining",
      date: new Date().toISOString()
    },
    {
      id: "2",
      type: "receive",
      amount: 2500.00,
      recipient: "Salary Deposit",
      description: "Monthly salary",
      category: "Income",
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "3",
      type: "send",
      amount: 89.50,
      recipient: "Shell Gas Station",
      description: "Gas refill",
      category: "Transportation",
      date: new Date(Date.now() - 172800000).toISOString()
    }
  ];
  return transactions;
};

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

// Mock Loans
export const fetchMockLoans = async () => {
  const loans = [
    {
      id: "1",
      type: "Personal Loan",
      amount: 15000,
      outstandingBalance: 12500,
      interestRate: 6.5,
      monthlyPayment: 450,
      nextPaymentDate: "2024-01-15",
      status: "Active",
      termMonths: 36,
      remainingMonths: 28
    },
    {
      id: "2",
      type: "Home Loan",
      amount: 250000,
      outstandingBalance: 185000,
      interestRate: 4.2,
      monthlyPayment: 1200,
      nextPaymentDate: "2024-01-20",
      status: "Active",
      termMonths: 240,
      remainingMonths: 180
    }
  ];
  return loans;
};

// Mock Investments
export const fetchMockInvestments = async () => {
  const investments = [
    {
      id: "1",
      name: "S&P 500 Index Fund",
      symbol: "SPY",
      type: "Mutual Fund",
      shares: 50,
      currentPrice: 425.30,
      totalValue: 21265.00,
      gainLoss: 1265.00,
      gainLossPercent: 6.32,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "2",
      name: "Apple Inc.",
      symbol: "AAPL",
      type: "Stock",
      shares: 25,
      currentPrice: 185.50,
      totalValue: 4637.50,
      gainLoss: -362.50,
      gainLossPercent: -7.25,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "3",
      name: "Bitcoin",
      symbol: "BTC",
      type: "Cryptocurrency",
      shares: 0.5,
      currentPrice: 45000.00,
      totalValue: 22500.00,
      gainLoss: 2500.00,
      gainLossPercent: 12.5,
      lastUpdated: new Date().toISOString()
    }
  ];
  return investments;
};

// Mock Bill Payments
export const fetchMockBills = async () => {
  const bills = [
    {
      id: "1",
      name: "Electricity Bill",
      provider: "Pacific Gas & Electric",
      amount: 125.50,
      dueDate: "2024-01-15",
      status: "Pending",
      category: "Utilities",
      isAutoPay: false,
      accountNumber: "**** 9876"
    },
    {
      id: "2",
      name: "Internet Service",
      provider: "Comcast",
      amount: 89.99,
      dueDate: "2024-01-20",
      status: "Paid",
      category: "Internet",
      isAutoPay: true,
      accountNumber: "**** 5432"
    },
    {
      id: "3",
      name: "Credit Card Payment",
      provider: "Visa Credit Card",
      amount: 450.00,
      dueDate: "2024-01-10",
      status: "Pending",
      category: "Credit Card",
      isAutoPay: true,
      accountNumber: "**** 1234"
    }
  ];
  return bills;
};

// Mock Notifications
export const fetchMockNotifications = async () => {
  const notifications = [
    {
      id: "1",
      title: "Payment Received",
      message: "You received $500 from Sarah Wilson",
      type: "success",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: false,
      actionUrl: "/transactions"
    },
    {
      id: "2",
      title: "Bill Reminder",
      message: "Your electricity bill of $125.50 is due in 3 days",
      type: "warning",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isRead: false,
      actionUrl: "/bills"
    },
    {
      id: "3",
      title: "Security Alert",
      message: "New login detected from unknown device",
      type: "alert",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isRead: true,
      actionUrl: "/security"
    }
  ];
  return notifications;
};

// Mock Financial Reports
export const fetchMockReports = async () => {
  const reports = {
    monthly: {
      income: 5200.00,
      expenses: 3850.00,
      savings: 1350.00,
      categories: [
        { name: "Food & Dining", amount: 650.00, percentage: 16.9 },
        { name: "Transportation", amount: 450.00, percentage: 11.7 },
        { name: "Utilities", amount: 320.00, percentage: 8.3 },
        { name: "Entertainment", amount: 280.00, percentage: 7.3 },
        { name: "Shopping", amount: 520.00, percentage: 13.5 },
        { name: "Other", amount: 1630.00, percentage: 42.3 }
      ]
    },
    yearly: {
      totalIncome: 62400.00,
      totalExpenses: 46200.00,
      totalSavings: 16200.00,
      netWorth: 45000.00
    }
  };
  return reports;
};

// Mock Security Settings
export const fetchMockSecuritySettings = async () => {
  const settings = {
    twoFactorAuth: true,
    biometricLogin: true,
    smsNotifications: true,
    emailNotifications: true,
    transactionAlerts: true,
    loginAlerts: true,
    maxTransactionLimit: 5000,
    dailySpendingLimit: 1000,
    blockedCountries: ["North Korea", "Iran"],
    trustedDevices: [
      { name: "iPhone 14 Pro", lastUsed: "2024-01-01", isTrusted: true },
      { name: "MacBook Pro", lastUsed: "2023-12-28", isTrusted: true }
    ]
  };
  return settings;
};
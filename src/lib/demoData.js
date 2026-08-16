// ============================================================
// Demo Data — hardcoded mock data for all admin dashboard sections
// Replace with real Supabase queries when ready
// ============================================================

// ---- EVENTS ----
export const demoEvents = [
  {
    id: 'evt-001',
    name: 'Morning Run Challenge',
    description: 'Run 5km before 8 AM for 7 consecutive days',
    date: '2026-08-20',
    endDate: '2026-08-27',
    location: 'Sofia, Bulgaria',
    status: 'active',
    participants: 234,
    maxParticipants: 500,
    xpReward: 150,
    category: 'health',
  },
  {
    id: 'evt-002',
    name: 'Book Club Sprint',
    description: 'Read 3 books in one month and share reviews',
    date: '2026-08-01',
    endDate: '2026-08-31',
    location: 'Online',
    status: 'active',
    participants: 89,
    maxParticipants: 200,
    xpReward: 200,
    category: 'mind',
  },
  {
    id: 'evt-003',
    name: 'Community Clean-Up',
    description: 'Organize and participate in local park cleaning',
    date: '2026-09-05',
    endDate: '2026-09-05',
    location: 'Plovdiv, Bulgaria',
    status: 'upcoming',
    participants: 45,
    maxParticipants: 100,
    xpReward: 300,
    category: 'social',
  },
  {
    id: 'evt-004',
    name: 'Cooking Masterclass',
    description: 'Learn to cook 5 healthy meals from scratch',
    date: '2026-07-10',
    endDate: '2026-07-15',
    location: 'Varna, Bulgaria',
    status: 'completed',
    participants: 150,
    maxParticipants: 150,
    xpReward: 120,
    category: 'health',
  },
  {
    id: 'evt-005',
    name: 'Meditation Marathon',
    description: '30 days of 15-minute daily meditation sessions',
    date: '2026-08-01',
    endDate: '2026-08-30',
    location: 'Online',
    status: 'active',
    participants: 312,
    maxParticipants: 1000,
    xpReward: 250,
    category: 'mind',
  },
  {
    id: 'evt-006',
    name: 'Photography Walk',
    description: 'Capture street art across the city — best photo wins',
    date: '2026-09-12',
    endDate: '2026-09-12',
    location: 'Burgas, Bulgaria',
    status: 'draft',
    participants: 0,
    maxParticipants: 50,
    xpReward: 180,
    category: 'social',
  },
  {
    id: 'evt-007',
    name: 'Cold Shower Challenge',
    description: 'Take a cold shower every morning for 14 days',
    date: '2026-07-01',
    endDate: '2026-07-14',
    location: 'Online',
    status: 'completed',
    participants: 420,
    maxParticipants: 500,
    xpReward: 100,
    category: 'health',
  },
  {
    id: 'evt-008',
    name: 'Volunteer Teaching',
    description: 'Teach basic coding to kids at local school',
    date: '2026-09-15',
    endDate: '2026-09-20',
    location: 'Sofia, Bulgaria',
    status: 'upcoming',
    participants: 12,
    maxParticipants: 30,
    xpReward: 500,
    category: 'social',
  },
];

// ---- REDEMPTIONS ----
export const demoRedemptions = [
  { id: 'red-001', user: 'Alex Petrov', avatar: '🧑‍💻', reward: 'Free Coffee Voucher', xpCost: 500, date: '2026-08-15', status: 'pending' },
  { id: 'red-002', user: 'Maria Ivanova', avatar: '👩‍🎨', reward: 'Gym Day Pass', xpCost: 800, date: '2026-08-14', status: 'approved' },
  { id: 'red-003', user: 'Stefan Kolev', avatar: '🧑‍🔬', reward: 'Movie Ticket x2', xpCost: 1200, date: '2026-08-14', status: 'approved' },
  { id: 'red-004', user: 'Elena Georgieva', avatar: '👩‍💼', reward: 'Book Store Gift Card', xpCost: 1500, date: '2026-08-13', status: 'rejected' },
  { id: 'red-005', user: 'Dimitar Nikolov', avatar: '🧑‍🚀', reward: 'Free Coffee Voucher', xpCost: 500, date: '2026-08-13', status: 'pending' },
  { id: 'red-006', user: 'Yana Todorova', avatar: '👩‍🏫', reward: 'Spa Treatment', xpCost: 3000, date: '2026-08-12', status: 'approved' },
  { id: 'red-007', user: 'Boris Stoyanov', avatar: '🧑‍🍳', reward: 'Restaurant Voucher', xpCost: 2000, date: '2026-08-12', status: 'pending' },
  { id: 'red-008', user: 'Nadia Hristova', avatar: '👩‍⚕️', reward: 'Gym Day Pass', xpCost: 800, date: '2026-08-11', status: 'approved' },
  { id: 'red-009', user: 'Kaloyan Dimitrov', avatar: '🧑‍🎤', reward: 'Free Coffee Voucher', xpCost: 500, date: '2026-08-11', status: 'approved' },
  { id: 'red-010', user: 'Silvia Marinova', avatar: '👩‍🔧', reward: 'Movie Ticket x2', xpCost: 1200, date: '2026-08-10', status: 'rejected' },
  { id: 'red-011', user: 'Todor Vasilev', avatar: '🧑‍✈️', reward: 'Book Store Gift Card', xpCost: 1500, date: '2026-08-10', status: 'pending' },
  { id: 'red-012', user: 'Polina Atanasova', avatar: '👩‍🎓', reward: 'Spa Treatment', xpCost: 3000, date: '2026-08-09', status: 'approved' },
];

// ---- PAYMENTS ----
export const demoPayments = [
  { id: 'pay-001', invoice: 'INV-2026-081', customer: 'FitLife Gym', amount: 2500, date: '2026-08-15', status: 'completed', method: 'Bank Transfer' },
  { id: 'pay-002', invoice: 'INV-2026-080', customer: 'BookWorm Ltd.', amount: 1800, date: '2026-08-13', status: 'completed', method: 'Stripe' },
  { id: 'pay-003', invoice: 'INV-2026-079', customer: 'CaféCorner', amount: 950, date: '2026-08-12', status: 'pending', method: 'Stripe' },
  { id: 'pay-004', invoice: 'INV-2026-078', customer: 'Cinema City', amount: 3200, date: '2026-08-10', status: 'completed', method: 'Bank Transfer' },
  { id: 'pay-005', invoice: 'INV-2026-077', customer: 'Zen Spa Studio', amount: 4100, date: '2026-08-08', status: 'completed', method: 'Stripe' },
  { id: 'pay-006', invoice: 'INV-2026-076', customer: 'TechHub Co.', amount: 1500, date: '2026-08-06', status: 'failed', method: 'Bank Transfer' },
  { id: 'pay-007', invoice: 'INV-2026-075', customer: 'GreenMarket', amount: 720, date: '2026-08-04', status: 'completed', method: 'Stripe' },
  { id: 'pay-008', invoice: 'INV-2026-074', customer: 'FitLife Gym', amount: 2500, date: '2026-08-01', status: 'completed', method: 'Bank Transfer' },
  { id: 'pay-009', invoice: 'INV-2026-073', customer: 'Adventure Park', amount: 5600, date: '2026-07-28', status: 'completed', method: 'Stripe' },
  { id: 'pay-010', invoice: 'INV-2026-072', customer: 'BookWorm Ltd.', amount: 1800, date: '2026-07-25', status: 'refunded', method: 'Stripe' },
];

// ---- EXPENSES ----
export const demoExpenses = [
  { id: 'exp-001', description: 'Facebook Ads Campaign', category: 'Marketing', amount: 1200, date: '2026-08-14' },
  { id: 'exp-002', description: 'Server Hosting (AWS)', category: 'Operations', amount: 450, date: '2026-08-13' },
  { id: 'exp-003', description: 'Coffee Voucher Rewards (x50)', category: 'Rewards', amount: 250, date: '2026-08-12' },
  { id: 'exp-004', description: 'UI/UX Freelancer', category: 'Staff', amount: 2800, date: '2026-08-10' },
  { id: 'exp-005', description: 'Google Ads Campaign', category: 'Marketing', amount: 980, date: '2026-08-09' },
  { id: 'exp-006', description: 'Gym Pass Rewards (x20)', category: 'Rewards', amount: 1600, date: '2026-08-08' },
  { id: 'exp-007', description: 'Domain Renewal', category: 'Operations', amount: 45, date: '2026-08-07' },
  { id: 'exp-008', description: 'Instagram Influencer', category: 'Marketing', amount: 3500, date: '2026-08-05' },
  { id: 'exp-009', description: 'Office Supplies', category: 'Other', amount: 180, date: '2026-08-04' },
  { id: 'exp-010', description: 'Movie Ticket Rewards (x30)', category: 'Rewards', amount: 900, date: '2026-08-03' },
  { id: 'exp-011', description: 'Backend Developer (part-time)', category: 'Staff', amount: 3200, date: '2026-08-01' },
  { id: 'exp-012', description: 'Supabase Pro Plan', category: 'Operations', amount: 25, date: '2026-08-01' },
];

// ---- REVENUE CHART DATA (last 7 months) ----
export const demoRevenueChart = [
  { month: 'Feb', revenue: 4200, expenses: 3100 },
  { month: 'Mar', revenue: 5800, expenses: 3800 },
  { month: 'Apr', revenue: 7100, expenses: 4200 },
  { month: 'May', revenue: 6400, expenses: 4600 },
  { month: 'Jun', revenue: 8900, expenses: 5100 },
  { month: 'Jul', revenue: 11200, expenses: 5800 },
  { month: 'Aug', revenue: 9800, expenses: 5200 },
];

// ---- EXPENSE CATEGORIES (for pie chart) ----
export const demoExpenseCategories = [
  { name: 'Marketing', value: 5680, color: '#E85D4A' },
  { name: 'Operations', value: 520, color: '#6B9FD4' },
  { name: 'Rewards', value: 2750, color: '#C8E650' },
  { name: 'Staff', value: 6000, color: '#D47BA8' },
  { name: 'Other', value: 180, color: '#E8956A' },
];

// ---- RECENT ACTIVITY ----
export const demoRecentActivity = [
  { id: 'act-01', text: 'Alex Petrov redeemed Free Coffee Voucher', time: '2 min ago', type: 'redemption' },
  { id: 'act-02', text: 'New payment received from FitLife Gym — $2,500', time: '15 min ago', type: 'payment' },
  { id: 'act-03', text: 'Morning Run Challenge reached 234 participants', time: '1 hr ago', type: 'event' },
  { id: 'act-04', text: 'Dimitar Nikolov redeemed Free Coffee Voucher', time: '2 hrs ago', type: 'redemption' },
  { id: 'act-05', text: 'Expense logged: Facebook Ads Campaign — $1,200', time: '3 hrs ago', type: 'expense' },
  { id: 'act-06', text: 'Boris Stoyanov redeemed Restaurant Voucher', time: '4 hrs ago', type: 'redemption' },
  { id: 'act-07', text: 'Photography Walk event created (draft)', time: '5 hrs ago', type: 'event' },
  { id: 'act-08', text: 'Payment failed from TechHub Co. — $1,500', time: '6 hrs ago', type: 'payment' },
];

// ---- KPI OVERVIEW ----
export const demoKPIs = {
  totalRevenue: { value: 24670, change: +12.5, period: 'vs last month' },
  activeEvents: { value: 3, change: +1, period: 'vs last month' },
  totalRedemptions: { value: 156, change: +23.1, period: 'vs last month' },
  monthlyExpenses: { value: 15130, change: -4.2, period: 'vs last month' },
};

// ---- BUSINESS PROFILE (settings) ----
export const demoBusinessProfile = {
  name: 'SideQuest HQ',
  email: 'business@sidequest.app',
  phone: '+359 88 123 4567',
  address: 'ul. Vitosha 42, Sofia, Bulgaria',
  website: 'https://sidequest.app',
  description: 'Gamified real-world missions platform',
  logo: null,
  notifications: {
    emailOnNewRedemption: true,
    emailOnPayment: true,
    emailWeeklySummary: true,
    pushOnNewParticipant: false,
  },
};

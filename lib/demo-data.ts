// ---------------------------------------------------------------------------
// Demo data for the Pogidja Tax Practice client portal prototype.
// All data is static and for demonstration purposes only.
// ---------------------------------------------------------------------------

export type CaseStatus =
  | 'new'
  | 'in_progress'
  | 'awaiting_client'
  | 'awaiting_sars'
  | 'review'
  | 'completed'
  | 'on_hold'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
export type DocStatus = 'pending' | 'received' | 'approved' | 'rejected'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'

export const STATUS_META: Record<
  CaseStatus,
  { label: string; tone: string }
> = {
  new: { label: 'New', tone: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  in_progress: {
    label: 'In Progress',
    tone: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
  awaiting_client: {
    label: 'Awaiting Client',
    tone: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  },
  awaiting_sars: {
    label: 'Awaiting SARS',
    tone: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  },
  review: {
    label: 'In Review',
    tone: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
  },
  completed: {
    label: 'Completed',
    tone: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  on_hold: {
    label: 'On Hold',
    tone: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
  },
}

export const PRIORITY_META: Record<Priority, { label: string; tone: string }> =
  {
    low: { label: 'Low', tone: 'bg-slate-500/15 text-slate-600 dark:text-slate-400' },
    medium: {
      label: 'Medium',
      tone: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    },
    high: {
      label: 'High',
      tone: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    },
    urgent: {
      label: 'Urgent',
      tone: 'bg-red-500/15 text-red-600 dark:text-red-400',
    },
  }

export const INVOICE_META: Record<InvoiceStatus, { label: string; tone: string }> =
  {
    draft: { label: 'Draft', tone: 'bg-slate-500/15 text-slate-600 dark:text-slate-400' },
    sent: { label: 'Sent', tone: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
    paid: {
      label: 'Paid',
      tone: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    },
    overdue: {
      label: 'Overdue',
      tone: 'bg-red-500/15 text-red-600 dark:text-red-400',
    },
  }

export const DOC_META: Record<DocStatus, { label: string; tone: string }> = {
  pending: { label: 'Pending', tone: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  received: { label: 'Received', tone: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  approved: {
    label: 'Approved',
    tone: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  rejected: { label: 'Rejected', tone: 'bg-red-500/15 text-red-600 dark:text-red-400' },
}

// ---------------------------------------------------------------------------
// Current signed-in client
// ---------------------------------------------------------------------------

export const currentClient = {
  id: 'client-001',
  firstName: 'John',
  lastName: 'Smith',
  fullName: 'John Smith',
  email: 'john.smith@brightwave.co.za',
  phone: '+27 82 555 0192',
  company: 'Brightwave Solutions (Pty) Ltd',
  taxNumber: '9021458163',
  vatNumber: '4820136597',
  entityType: 'Private Company',
  address: '14 Rivonia Road, Sandton',
  city: 'Johannesburg',
  province: 'Gauteng',
  avatar: '',
  memberSince: '2022-03-14',
}

// ---------------------------------------------------------------------------
// Service catalogue
// ---------------------------------------------------------------------------

export const serviceCatalogue = [
  {
    id: 'individual_tax',
    name: 'Individual Tax Return',
    description: 'Personal income tax return (ITR12) preparation and submission.',
    price: 'From R1,200',
    turnaround: '3–5 business days',
  },
  {
    id: 'company_tax',
    name: 'Company Tax Return',
    description: 'Corporate income tax return (ITR14) for registered companies.',
    price: 'From R3,500',
    turnaround: '5–10 business days',
  },
  {
    id: 'vat_registration',
    name: 'VAT Registration',
    description: 'Register your business for Value-Added Tax with SARS.',
    price: 'From R1,800',
    turnaround: '10–21 business days',
  },
  {
    id: 'bookkeeping',
    name: 'Bookkeeping',
    description: 'Monthly bookkeeping, reconciliations and management accounts.',
    price: 'From R2,500/mo',
    turnaround: 'Ongoing',
  },
  {
    id: 'payroll',
    name: 'Payroll',
    description: 'Monthly payroll processing, payslips, EMP201 and IRP5s.',
    price: 'From R1,500/mo',
    turnaround: 'Ongoing',
  },
  {
    id: 'afs',
    name: 'Annual Financial Statements',
    description: 'Compilation of IFRS-compliant annual financial statements.',
    price: 'From R6,500',
    turnaround: '2–4 weeks',
  },
  {
    id: 'tax_clearance',
    name: 'Tax Clearance',
    description: 'Tax Compliance Status (TCS) PIN and clearance certificate.',
    price: 'From R950',
    turnaround: '2–5 business days',
  },
  {
    id: 'company_registration',
    name: 'Company Registration',
    description: 'New company registration with CIPC, including name reservation.',
    price: 'From R1,250',
    turnaround: '5–10 business days',
  },
  {
    id: 'business_advisory',
    name: 'Business Advisory',
    description: 'Strategic financial advisory, budgeting and forecasting.',
    price: 'Custom quote',
    turnaround: 'By arrangement',
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Not sure what you need? Describe it and we will guide you.',
    price: 'Custom quote',
    turnaround: 'By arrangement',
  },
] as const

// ---------------------------------------------------------------------------
// Staff / accountants
// ---------------------------------------------------------------------------

export const staff = [
  {
    id: 'staff-001',
    name: 'Thandiwe Mokoena',
    role: 'Owner / Managing Partner',
    title: 'CA(SA)',
    email: 'thandiwe@pogidja.co.za',
    avatar: '',
    activeCases: 12,
    completedThisMonth: 9,
    utilisation: 92,
  },
  {
    id: 'staff-002',
    name: 'Sipho Nkosi',
    role: 'Senior Accountant',
    title: 'CA(SA)',
    email: 'sipho@pogidja.co.za',
    avatar: '',
    activeCases: 18,
    completedThisMonth: 14,
    utilisation: 88,
  },
  {
    id: 'staff-003',
    name: 'Aisha Patel',
    role: 'Tax Specialist',
    title: 'MTP(SA)',
    email: 'aisha@pogidja.co.za',
    avatar: '',
    activeCases: 15,
    completedThisMonth: 11,
    utilisation: 81,
  },
  {
    id: 'staff-004',
    name: 'Daniel van der Merwe',
    role: 'Accountant',
    title: 'SAIPA',
    email: 'daniel@pogidja.co.za',
    avatar: '',
    activeCases: 10,
    completedThisMonth: 7,
    utilisation: 74,
  },
]

// ---------------------------------------------------------------------------
// Client's active services (for client dashboard)
// ---------------------------------------------------------------------------

export interface CaseRecord {
  id: string
  reference: string
  title: string
  service: string
  clientId: string
  clientName: string
  company: string
  status: CaseStatus
  priority: Priority
  progress: number
  assignedTo: string
  assignedName: string
  dueDate: string
  createdAt: string
  estimatedCompletion: string
}

export const cases: CaseRecord[] = [
  {
    id: 'case-1001',
    reference: 'POG-2026-1001',
    title: '2025 Company Tax Return (ITR14)',
    service: 'Company Tax Return',
    clientId: 'client-001',
    clientName: 'John Smith',
    company: 'Brightwave Solutions (Pty) Ltd',
    status: 'in_progress',
    priority: 'high',
    progress: 65,
    assignedTo: 'staff-002',
    assignedName: 'Sipho Nkosi',
    dueDate: '2026-07-20',
    createdAt: '2026-06-12',
    estimatedCompletion: '2026-07-18',
  },
  {
    id: 'case-1002',
    reference: 'POG-2026-1002',
    title: 'Monthly Bookkeeping — June 2026',
    service: 'Bookkeeping',
    clientId: 'client-001',
    clientName: 'John Smith',
    company: 'Brightwave Solutions (Pty) Ltd',
    status: 'awaiting_client',
    priority: 'medium',
    progress: 40,
    assignedTo: 'staff-004',
    assignedName: 'Daniel van der Merwe',
    dueDate: '2026-07-10',
    createdAt: '2026-06-30',
    estimatedCompletion: '2026-07-09',
  },
  {
    id: 'case-1003',
    reference: 'POG-2026-1003',
    title: 'VAT Registration',
    service: 'VAT Registration',
    clientId: 'client-001',
    clientName: 'John Smith',
    company: 'Brightwave Solutions (Pty) Ltd',
    status: 'awaiting_sars',
    priority: 'medium',
    progress: 80,
    assignedTo: 'staff-003',
    assignedName: 'Aisha Patel',
    dueDate: '2026-07-25',
    createdAt: '2026-06-05',
    estimatedCompletion: '2026-07-22',
  },
  {
    id: 'case-1004',
    reference: 'POG-2026-1004',
    title: '2025 Individual Tax Return (ITR12)',
    service: 'Individual Tax Return',
    clientId: 'client-002',
    clientName: 'Nomvula Dlamini',
    company: 'Sole Proprietor',
    status: 'new',
    priority: 'low',
    progress: 5,
    assignedTo: 'staff-003',
    assignedName: 'Aisha Patel',
    dueDate: '2026-08-01',
    createdAt: '2026-07-01',
    estimatedCompletion: '2026-07-28',
  },
  {
    id: 'case-1005',
    reference: 'POG-2026-1005',
    title: 'Annual Financial Statements 2025',
    service: 'Annual Financial Statements',
    clientId: 'client-003',
    clientName: 'Kagiso Molefe',
    company: 'Molefe Logistics CC',
    status: 'review',
    priority: 'high',
    progress: 90,
    assignedTo: 'staff-002',
    assignedName: 'Sipho Nkosi',
    dueDate: '2026-07-15',
    createdAt: '2026-05-20',
    estimatedCompletion: '2026-07-14',
  },
  {
    id: 'case-1006',
    reference: 'POG-2026-1006',
    title: 'Payroll Setup & June Run',
    service: 'Payroll',
    clientId: 'client-004',
    clientName: 'Lerato Khumalo',
    company: 'Khumalo Retail Group',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    assignedTo: 'staff-004',
    assignedName: 'Daniel van der Merwe',
    dueDate: '2026-06-28',
    createdAt: '2026-06-01',
    estimatedCompletion: '2026-06-27',
  },
  {
    id: 'case-1007',
    reference: 'POG-2026-1007',
    title: 'Tax Clearance Certificate',
    service: 'Tax Clearance',
    clientId: 'client-005',
    clientName: 'Pieter Botha',
    company: 'Botha Construction (Pty) Ltd',
    status: 'on_hold',
    priority: 'low',
    progress: 30,
    assignedTo: 'staff-003',
    assignedName: 'Aisha Patel',
    dueDate: '2026-07-30',
    createdAt: '2026-06-18',
    estimatedCompletion: '2026-07-26',
  },
  {
    id: 'case-1008',
    reference: 'POG-2026-1008',
    title: 'Company Registration — NewCo',
    service: 'Company Registration',
    clientId: 'client-006',
    clientName: 'Zanele Mahlangu',
    company: 'Mahlangu Ventures',
    status: 'in_progress',
    priority: 'urgent',
    progress: 55,
    assignedTo: 'staff-001',
    assignedName: 'Thandiwe Mokoena',
    dueDate: '2026-07-12',
    createdAt: '2026-06-25',
    estimatedCompletion: '2026-07-11',
  },
]

// The three active services shown on the client dashboard
export const clientActiveCases = cases.filter(
  (c) => c.clientId === 'client-001' && c.status !== 'completed',
)

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export interface NotificationRecord {
  id: string
  title: string
  body: string
  category: 'case' | 'document' | 'invoice' | 'message' | 'system'
  createdAt: string
  read: boolean
  link: string
}

export const notifications: NotificationRecord[] = [
  {
    id: 'n1',
    title: 'Document approved',
    body: 'Your June bank statement was approved by Sipho Nkosi.',
    category: 'document',
    createdAt: '2026-07-02T08:20:00',
    read: false,
    link: '/portal/documents',
  },
  {
    id: 'n2',
    title: 'Action required',
    body: 'Please upload your outstanding invoices for June bookkeeping.',
    category: 'case',
    createdAt: '2026-07-01T14:05:00',
    read: false,
    link: '/portal/cases/case-1002',
  },
  {
    id: 'n3',
    title: 'New message from Sipho',
    body: 'I have a quick question about your vehicle expense claims.',
    category: 'message',
    createdAt: '2026-07-01T11:32:00',
    read: false,
    link: '/portal/messages',
  },
  {
    id: 'n4',
    title: 'Invoice issued',
    body: 'Invoice INV-2026-0087 for R4,025.00 is now available.',
    category: 'invoice',
    createdAt: '2026-06-29T09:00:00',
    read: true,
    link: '/portal/cases/case-1001',
  },
  {
    id: 'n5',
    title: 'VAT registration update',
    body: 'Your VAT registration has been submitted to SARS for review.',
    category: 'case',
    createdAt: '2026-06-27T16:45:00',
    read: true,
    link: '/portal/cases/case-1003',
  },
  {
    id: 'n6',
    title: 'Welcome to Pogidja',
    body: 'Your client portal is ready. Explore your dashboard to get started.',
    category: 'system',
    createdAt: '2026-06-20T10:00:00',
    read: true,
    link: '/portal',
  },
]

// ---------------------------------------------------------------------------
// Messages / chat threads
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string
  from: 'client' | 'staff'
  author: string
  body: string
  time: string
}

export interface MessageThread {
  id: string
  subject: string
  caseRef: string
  counterpart: string
  counterpartRole: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: ChatMessage[]
}

export const threads: MessageThread[] = [
  {
    id: 'thread-1',
    subject: '2025 Company Tax Return',
    caseRef: 'POG-2026-1001',
    counterpart: 'Sipho Nkosi',
    counterpartRole: 'Senior Accountant',
    lastMessage: 'I have a quick question about your vehicle expense claims.',
    lastTime: '2026-07-01T11:32:00',
    unread: 2,
    messages: [
      {
        id: 'm1',
        from: 'staff',
        author: 'Sipho Nkosi',
        body: "Hi John, I've started on your ITR14 for the 2025 year of assessment.",
        time: '2026-06-28T09:15:00',
      },
      {
        id: 'm2',
        from: 'client',
        author: 'John Smith',
        body: 'Great, thanks Sipho. Let me know if you need anything from my side.',
        time: '2026-06-28T09:40:00',
      },
      {
        id: 'm3',
        from: 'staff',
        author: 'Sipho Nkosi',
        body: 'Could you confirm the total kilometres travelled for business in 2025?',
        time: '2026-06-30T10:10:00',
      },
      {
        id: 'm4',
        from: 'staff',
        author: 'Sipho Nkosi',
        body: 'I have a quick question about your vehicle expense claims.',
        time: '2026-07-01T11:32:00',
      },
    ],
  },
  {
    id: 'thread-2',
    subject: 'June Bookkeeping documents',
    caseRef: 'POG-2026-1002',
    counterpart: 'Daniel van der Merwe',
    counterpartRole: 'Accountant',
    lastMessage: 'Please upload the outstanding supplier invoices when you can.',
    lastTime: '2026-07-01T14:05:00',
    unread: 0,
    messages: [
      {
        id: 'm5',
        from: 'staff',
        author: 'Daniel van der Merwe',
        body: 'Hi John, I am reconciling June now. A few supplier invoices are missing.',
        time: '2026-07-01T13:50:00',
      },
      {
        id: 'm6',
        from: 'staff',
        author: 'Daniel van der Merwe',
        body: 'Please upload the outstanding supplier invoices when you can.',
        time: '2026-07-01T14:05:00',
      },
    ],
  },
  {
    id: 'thread-3',
    subject: 'VAT Registration progress',
    caseRef: 'POG-2026-1003',
    counterpart: 'Aisha Patel',
    counterpartRole: 'Tax Specialist',
    lastMessage: 'Submitted to SARS — I will update you as soon as we hear back.',
    lastTime: '2026-06-27T16:45:00',
    unread: 0,
    messages: [
      {
        id: 'm7',
        from: 'client',
        author: 'John Smith',
        body: 'Any news on the VAT registration?',
        time: '2026-06-27T15:30:00',
      },
      {
        id: 'm8',
        from: 'staff',
        author: 'Aisha Patel',
        body: 'Submitted to SARS — I will update you as soon as we hear back.',
        time: '2026-06-27T16:45:00',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export interface DocumentRecord {
  id: string
  name: string
  category: string
  type: string
  size: string
  status: DocStatus
  uploadedBy: string
  caseRef: string
  createdAt: string
}

export const documents: DocumentRecord[] = [
  {
    id: 'doc-1',
    name: 'Bank Statement — June 2026.pdf',
    category: 'Bank Statements',
    type: 'PDF',
    size: '1.2 MB',
    status: 'approved',
    uploadedBy: 'John Smith',
    caseRef: 'POG-2026-1002',
    createdAt: '2026-07-01T08:00:00',
  },
  {
    id: 'doc-2',
    name: 'ITR14 Draft 2025.pdf',
    category: 'Tax Returns',
    type: 'PDF',
    size: '640 KB',
    status: 'received',
    uploadedBy: 'Sipho Nkosi',
    caseRef: 'POG-2026-1001',
    createdAt: '2026-06-30T15:20:00',
  },
  {
    id: 'doc-3',
    name: 'Vehicle Logbook 2025.xlsx',
    category: 'Supporting Documents',
    type: 'XLSX',
    size: '320 KB',
    status: 'pending',
    uploadedBy: 'John Smith',
    caseRef: 'POG-2026-1001',
    createdAt: '2026-06-29T11:10:00',
  },
  {
    id: 'doc-4',
    name: 'CIPC Registration Certificate.pdf',
    category: 'Company Records',
    type: 'PDF',
    size: '210 KB',
    status: 'approved',
    uploadedBy: 'John Smith',
    caseRef: 'POG-2026-1003',
    createdAt: '2026-06-05T09:30:00',
  },
  {
    id: 'doc-5',
    name: 'Payroll Summary June.pdf',
    category: 'Payroll',
    type: 'PDF',
    size: '480 KB',
    status: 'approved',
    uploadedBy: 'Daniel van der Merwe',
    caseRef: 'POG-2026-1002',
    createdAt: '2026-06-28T14:00:00',
  },
  {
    id: 'doc-6',
    name: 'Supplier Invoices June.zip',
    category: 'Supporting Documents',
    type: 'ZIP',
    size: '3.8 MB',
    status: 'rejected',
    uploadedBy: 'John Smith',
    caseRef: 'POG-2026-1002',
    createdAt: '2026-06-27T16:00:00',
  },
  {
    id: 'doc-7',
    name: 'ID Document.pdf',
    category: 'KYC',
    type: 'PDF',
    size: '150 KB',
    status: 'approved',
    uploadedBy: 'John Smith',
    caseRef: 'POG-2026-1001',
    createdAt: '2026-03-14T10:00:00',
  },
  {
    id: 'doc-8',
    name: 'Management Accounts Q1.pdf',
    category: 'Financials',
    type: 'PDF',
    size: '890 KB',
    status: 'approved',
    uploadedBy: 'Sipho Nkosi',
    caseRef: 'POG-2026-1002',
    createdAt: '2026-04-10T13:20:00',
  },
]

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------

export interface InvoiceRecord {
  id: string
  number: string
  clientName: string
  caseRef: string
  amount: number
  status: InvoiceStatus
  issueDate: string
  dueDate: string
}

export const invoices: InvoiceRecord[] = [
  {
    id: 'inv-1',
    number: 'INV-2026-0087',
    clientName: 'Brightwave Solutions (Pty) Ltd',
    caseRef: 'POG-2026-1001',
    amount: 4025.0,
    status: 'sent',
    issueDate: '2026-06-29',
    dueDate: '2026-07-14',
  },
  {
    id: 'inv-2',
    number: 'INV-2026-0072',
    clientName: 'Brightwave Solutions (Pty) Ltd',
    caseRef: 'POG-2026-1002',
    amount: 2875.0,
    status: 'paid',
    issueDate: '2026-06-01',
    dueDate: '2026-06-15',
  },
  {
    id: 'inv-3',
    number: 'INV-2026-0090',
    clientName: 'Molefe Logistics CC',
    caseRef: 'POG-2026-1005',
    amount: 7475.0,
    status: 'overdue',
    issueDate: '2026-06-10',
    dueDate: '2026-06-25',
  },
  {
    id: 'inv-4',
    number: 'INV-2026-0091',
    clientName: 'Khumalo Retail Group',
    caseRef: 'POG-2026-1006',
    amount: 1725.0,
    status: 'paid',
    issueDate: '2026-06-05',
    dueDate: '2026-06-20',
  },
  {
    id: 'inv-5',
    number: 'INV-2026-0092',
    clientName: 'Mahlangu Ventures',
    caseRef: 'POG-2026-1008',
    amount: 1437.5,
    status: 'draft',
    issueDate: '2026-07-01',
    dueDate: '2026-07-16',
  },
]

export const clientOutstandingInvoice = invoices.find(
  (i) => i.number === 'INV-2026-0087',
)!

// ---------------------------------------------------------------------------
// Clients (for staff client management)
// ---------------------------------------------------------------------------

export interface ClientRecord {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  entityType: string
  status: 'active' | 'prospect' | 'inactive'
  activeCases: number
  accountant: string
  city: string
  since: string
}

export const clients: ClientRecord[] = [
  {
    id: 'client-001',
    name: 'Brightwave Solutions (Pty) Ltd',
    contact: 'John Smith',
    email: 'john.smith@brightwave.co.za',
    phone: '+27 82 555 0192',
    entityType: 'Private Company',
    status: 'active',
    activeCases: 3,
    accountant: 'Sipho Nkosi',
    city: 'Johannesburg',
    since: '2022-03-14',
  },
  {
    id: 'client-002',
    name: 'Nomvula Dlamini',
    contact: 'Nomvula Dlamini',
    email: 'nomvula.d@gmail.com',
    phone: '+27 71 234 5566',
    entityType: 'Sole Proprietor',
    status: 'active',
    activeCases: 1,
    accountant: 'Aisha Patel',
    city: 'Pretoria',
    since: '2024-01-22',
  },
  {
    id: 'client-003',
    name: 'Molefe Logistics CC',
    contact: 'Kagiso Molefe',
    email: 'kagiso@molefelogistics.co.za',
    phone: '+27 83 998 1200',
    entityType: 'Close Corporation',
    status: 'active',
    activeCases: 1,
    accountant: 'Sipho Nkosi',
    city: 'Polokwane',
    since: '2021-08-09',
  },
  {
    id: 'client-004',
    name: 'Khumalo Retail Group',
    contact: 'Lerato Khumalo',
    email: 'lerato@khumaloretail.co.za',
    phone: '+27 84 456 7788',
    entityType: 'Private Company',
    status: 'active',
    activeCases: 0,
    accountant: 'Daniel van der Merwe',
    city: 'Durban',
    since: '2023-05-30',
  },
  {
    id: 'client-005',
    name: 'Botha Construction (Pty) Ltd',
    contact: 'Pieter Botha',
    email: 'pieter@bothaconstruction.co.za',
    phone: '+27 82 771 3344',
    entityType: 'Private Company',
    status: 'inactive',
    activeCases: 1,
    accountant: 'Aisha Patel',
    city: 'Bloemfontein',
    since: '2020-11-15',
  },
  {
    id: 'client-006',
    name: 'Mahlangu Ventures',
    contact: 'Zanele Mahlangu',
    email: 'zanele@mahlanguventures.co.za',
    phone: '+27 79 220 8899',
    entityType: 'Prospect',
    status: 'prospect',
    activeCases: 1,
    accountant: 'Thandiwe Mokoena',
    city: 'Nelspruit',
    since: '2026-06-25',
  },
  {
    id: 'client-007',
    name: 'Ndlovu Trading Enterprise',
    contact: 'Bongani Ndlovu',
    email: 'bongani@ndlovutrading.co.za',
    phone: '+27 81 665 4433',
    entityType: 'Sole Proprietor',
    status: 'active',
    activeCases: 2,
    accountant: 'Daniel van der Merwe',
    city: 'East London',
    since: '2023-09-12',
  },
  {
    id: 'client-008',
    name: 'Coastal Fisheries CC',
    contact: 'Maria Santos',
    email: 'maria@coastalfisheries.co.za',
    phone: '+27 82 334 1199',
    entityType: 'Close Corporation',
    status: 'active',
    activeCases: 1,
    accountant: 'Sipho Nkosi',
    city: 'Cape Town',
    since: '2022-07-01',
  },
]

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export interface TaskRecord {
  id: string
  title: string
  caseRef: string
  assignee: string
  priority: Priority
  status: TaskStatus
  due: string
}

export const tasks: TaskRecord[] = [
  {
    id: 't1',
    title: 'Request vehicle logbook from client',
    caseRef: 'POG-2026-1001',
    assignee: 'Sipho Nkosi',
    priority: 'high',
    status: 'in_progress',
    due: '2026-07-05',
  },
  {
    id: 't2',
    title: 'Reconcile June bank statement',
    caseRef: 'POG-2026-1002',
    assignee: 'Daniel van der Merwe',
    priority: 'medium',
    status: 'todo',
    due: '2026-07-08',
  },
  {
    id: 't3',
    title: 'Follow up SARS on VAT registration',
    caseRef: 'POG-2026-1003',
    assignee: 'Aisha Patel',
    priority: 'medium',
    status: 'todo',
    due: '2026-07-10',
  },
  {
    id: 't4',
    title: 'Partner review of AFS 2025',
    caseRef: 'POG-2026-1005',
    assignee: 'Thandiwe Mokoena',
    priority: 'high',
    status: 'review',
    due: '2026-07-12',
  },
  {
    id: 't5',
    title: 'Submit CIPC name reservation',
    caseRef: 'POG-2026-1008',
    assignee: 'Thandiwe Mokoena',
    priority: 'urgent',
    status: 'in_progress',
    due: '2026-07-04',
  },
  {
    id: 't6',
    title: 'Prepare payslips for June run',
    caseRef: 'POG-2026-1006',
    assignee: 'Daniel van der Merwe',
    priority: 'medium',
    status: 'done',
    due: '2026-06-27',
  },
  {
    id: 't7',
    title: 'Draft engagement letter for new client',
    caseRef: 'POG-2026-1004',
    assignee: 'Aisha Patel',
    priority: 'low',
    status: 'todo',
    due: '2026-07-09',
  },
  {
    id: 't8',
    title: 'Issue invoice for ITR14 work',
    caseRef: 'POG-2026-1001',
    assignee: 'Sipho Nkosi',
    priority: 'low',
    status: 'done',
    due: '2026-06-29',
  },
]

// ---------------------------------------------------------------------------
// Workflow / Kanban stages
// ---------------------------------------------------------------------------

export const workflowStages = [
  { id: 'new', label: 'New Requests' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'awaiting_client', label: 'Awaiting Client' },
  { id: 'review', label: 'Review' },
  { id: 'completed', label: 'Completed' },
] as const

// ---------------------------------------------------------------------------
// Activity log
// ---------------------------------------------------------------------------

export interface ActivityRecord {
  id: string
  actor: string
  action: string
  target: string
  time: string
  type: 'case' | 'document' | 'invoice' | 'message' | 'client'
}

export const activityLog: ActivityRecord[] = [
  {
    id: 'a1',
    actor: 'Sipho Nkosi',
    action: 'approved document',
    target: 'Bank Statement — June 2026.pdf',
    time: '2026-07-02T08:20:00',
    type: 'document',
  },
  {
    id: 'a2',
    actor: 'Aisha Patel',
    action: 'submitted VAT registration to SARS for',
    target: 'Brightwave Solutions',
    time: '2026-07-01T16:45:00',
    type: 'case',
  },
  {
    id: 'a3',
    actor: 'John Smith',
    action: 'uploaded',
    target: 'Vehicle Logbook 2025.xlsx',
    time: '2026-07-01T11:10:00',
    type: 'document',
  },
  {
    id: 'a4',
    actor: 'Daniel van der Merwe',
    action: 'created case',
    target: 'POG-2026-1002',
    time: '2026-06-30T09:00:00',
    type: 'case',
  },
  {
    id: 'a5',
    actor: 'Thandiwe Mokoena',
    action: 'onboarded new client',
    target: 'Mahlangu Ventures',
    time: '2026-06-25T10:30:00',
    type: 'client',
  },
  {
    id: 'a6',
    actor: 'Sipho Nkosi',
    action: 'issued invoice',
    target: 'INV-2026-0087',
    time: '2026-06-29T09:00:00',
    type: 'invoice',
  },
]

// ---------------------------------------------------------------------------
// Case timeline (for case detail view)
// ---------------------------------------------------------------------------

export interface TimelineEvent {
  id: string
  title: string
  description: string
  time: string
  done: boolean
}

export const caseTimeline: TimelineEvent[] = [
  {
    id: 'tl1',
    title: 'Case created',
    description: 'Engagement opened and assigned to Sipho Nkosi.',
    time: '2026-06-12T09:00:00',
    done: true,
  },
  {
    id: 'tl2',
    title: 'Documents requested',
    description: 'Requested prior year financials and supporting schedules.',
    time: '2026-06-14T10:30:00',
    done: true,
  },
  {
    id: 'tl3',
    title: 'Documents received',
    description: 'Client uploaded bank statements and logbook.',
    time: '2026-06-20T14:15:00',
    done: true,
  },
  {
    id: 'tl4',
    title: 'Return in preparation',
    description: 'ITR14 draft being prepared and reviewed internally.',
    time: '2026-06-30T11:00:00',
    done: true,
  },
  {
    id: 'tl5',
    title: 'Client review',
    description: 'Awaiting client confirmation of vehicle expense claims.',
    time: '2026-07-01T11:30:00',
    done: false,
  },
  {
    id: 'tl6',
    title: 'Submission to SARS',
    description: 'Final return to be filed on eFiling.',
    time: '2026-07-18T00:00:00',
    done: false,
  },
]

// ---------------------------------------------------------------------------
// Chart data (owner dashboard & reports)
// ---------------------------------------------------------------------------

export const revenueByMonth = [
  { month: 'Jan', revenue: 182000, target: 175000 },
  { month: 'Feb', revenue: 168000, target: 175000 },
  { month: 'Mar', revenue: 214000, target: 190000 },
  { month: 'Apr', revenue: 198000, target: 190000 },
  { month: 'May', revenue: 236000, target: 210000 },
  { month: 'Jun', revenue: 258000, target: 210000 },
]

export const casesByService = [
  { service: 'Tax Returns', count: 42 },
  { service: 'Bookkeeping', count: 31 },
  { service: 'Payroll', count: 24 },
  { service: 'VAT', count: 18 },
  { service: 'AFS', count: 14 },
  { service: 'Advisory', count: 9 },
]

export const caseStatusBreakdown = [
  { status: 'In Progress', value: 34, fill: 'var(--chart-1)' },
  { status: 'Awaiting Client', value: 18, fill: 'var(--chart-2)' },
  { status: 'Review', value: 12, fill: 'var(--chart-3)' },
  { status: 'Completed', value: 56, fill: 'var(--chart-4)' },
]

export const newVsCompleted = [
  { month: 'Jan', created: 22, completed: 18 },
  { month: 'Feb', created: 19, completed: 21 },
  { month: 'Mar', created: 28, completed: 24 },
  { month: 'Apr', created: 25, completed: 26 },
  { month: 'May', created: 31, completed: 27 },
  { month: 'Jun', created: 34, completed: 30 },
]

// ---------------------------------------------------------------------------
// Owner dashboard KPIs
// ---------------------------------------------------------------------------

export const ownerKpis = {
  newRequests: 7,
  openCases: 34,
  completedThisMonth: 30,
  awaitingClient: 18,
  awaitingSars: 11,
  monthRevenue: 258000,
  revenueChange: 9.3,
  activeClients: 128,
  clientChange: 4.1,
}

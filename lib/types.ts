export type UserRole = 'owner' | 'admin' | 'accountant' | 'client'

export type CaseStatus =
  | 'new'
  | 'in_progress'
  | 'awaiting_client'
  | 'review'
  | 'completed'
  | 'on_hold'
  | 'cancelled'

export type CasePriority = 'low' | 'medium' | 'high' | 'urgent'

export type DocStatus =
  | 'pending'
  | 'received'
  | 'approved'
  | 'rejected'
  | 'archived'

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled'

export interface Profile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  job_title: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  owner_id: string | null
  company_name: string | null
  contact_name: string
  email: string
  phone: string | null
  tax_number: string | null
  vat_number: string | null
  entity_type: string | null
  address: string | null
  city: string | null
  province: string | null
  assigned_accountant: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Case {
  id: string
  reference: string
  client_id: string
  title: string
  description: string | null
  service_type: string | null
  status: CaseStatus
  priority: CasePriority
  assigned_to: string | null
  due_date: string | null
  progress: number
  created_at: string
  updated_at: string
}

export interface CaseUpdate {
  id: string
  case_id: string
  author_id: string | null
  body: string
  update_type: string
  is_client_visible: boolean
  created_at: string
}

export interface Document {
  id: string
  client_id: string | null
  case_id: string | null
  uploaded_by: string | null
  name: string
  category: string | null
  file_path: string | null
  file_size: number | null
  mime_type: string | null
  status: DocStatus
  created_at: string
}

export interface MessageThread {
  id: string
  client_id: string
  case_id: string | null
  subject: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  thread_id: string
  sender_id: string | null
  body: string
  read_at: string | null
  created_at: string
}

export interface LineItem {
  description: string
  qty: number
  unit_price: number
  total: number
}

export interface Invoice {
  id: string
  invoice_number: string
  client_id: string
  case_id: string | null
  amount: number
  tax_amount: number
  total_amount: number
  currency: string
  status: InvoiceStatus
  issue_date: string
  due_date: string | null
  paid_date: string | null
  line_items: LineItem[]
  notes: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string | null
  category: string
  link: string | null
  read_at: string | null
  created_at: string
}

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  new: 'New',
  in_progress: 'In Progress',
  awaiting_client: 'Awaiting You',
  review: 'In Review',
  completed: 'Completed',
  on_hold: 'On Hold',
  cancelled: 'Cancelled',
}

export const DOC_STATUS_LABELS: Record<DocStatus, string> = {
  pending: 'Pending',
  received: 'Received',
  approved: 'Approved',
  rejected: 'Rejected',
  archived: 'Archived',
}

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}

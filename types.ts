// User related types
export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  Staff = 'Staff',
  AssetManager = 'Asset Manager',
  Finance = 'Finance',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  avatarUrl: string;
}

// Task related types
export enum TaskPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface ProjectTask {
  id: string;
  title: string;
  assignee: User;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  completed: boolean;
  dependencies?: string[];
}

export interface UserTask {
  id: string;
  userId: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
}


// Project related types
export enum ProjectStatus {
  OnProgress = 'On Progress',
  Pitching = 'Pitching',
  Completed = 'Completed',
  Approved = 'Approved',
  Revision = 'Revision',
  Archived = 'Archived',
}

export enum ExpenseStatus {
  Approved = 'Approved',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

export interface Expense {
  id: string;
  item: string;
  amount: number;
  date: string; // YYYY-MM-DD
  status: ExpenseStatus;
  receiptFilenames?: string[];
}

export interface Vendor {
  id: string;
  name: string;
  service: string;
  contact: string;
}

export interface ProjectHistoryLog {
  id: string;
  timestamp: string; // ISO String
  user: User;
  action: string;
}

export interface HandoverLog {
    id: string;
    timestamp: string; // ISO String for initiation
    fromPIC: User;
    toPIC: User;
    briefingContent: string; // AI-generated briefing
    confirmationTimestamp?: string; // ISO String for confirmation
}

export enum LpjStatus {
  Approved = 'Approved',
  Submitted = 'Submitted',
  Draft = 'Draft',
  Revision = 'Revision',
}

export interface Lpj {
    id: string;
    status: LpjStatus;
    notes: string;
    submittedDate?: string; // YYYY-MM-DD
    approvedDate?: string; // YYYY-MM-DD
    financialSummary: {
        totalIncome: number;
        totalExpense: number;
        finalBalance: number;
    };
    attachments: string[];
}

export interface UsedAssetLog {
    asset: Asset;
    checkoutDate: string; // ISO string
    returnDate?: string; // ISO string
}

export interface Project {
  id: string;
  name: string;
  pic: User;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: ProjectStatus;
  budget: {
    modal: number;
    pemasukan: number;
  };
  team: User[];
  vendors: Vendor[];
  expenses: Expense[];
  tasks: ProjectTask[];
  history: ProjectHistoryLog[];
  handoverHistory?: HandoverLog[];
  lpj?: Lpj;
  usedAssets?: UsedAssetLog[];
}

// Asset related types
export enum AssetType {
  Permanent = 'Permanent',
  Rent = 'Sewa',
}

export enum AssetStatus {
  Available = 'Tersedia',
  InUse = 'Digunakan',
  Maintenance = 'Dalam Perbaikan',
  RentedOut = 'Disewakan',
  Broken = 'Rusak',
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  lastMaintenance: string; // YYYY-MM-DD
  managedBy: User;
  nextMaintenance?: string; // YYYY-MM-DD
  rentedUntil?: string; // YYYY-MM-DD
}

// Document related types
export type DocumentCategory = 'Venue' | 'Konsep' | 'Talent' | 'Vendor' | 'MOU & SPK' | 'Invoice & Kuitansi' | 'Legalitas';
export type DocumentFileType = 'PDF' | 'DOCX' | 'JPG';

export interface Document {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory;
  fileType: DocumentFileType;
  version: number;
  lastUpdated: string; // YYYY-MM-DD
  tags: string[];
}

// Notification related types
export type NotificationType = 'general' | 'new_project' | 'task_completed' | 'handover_request';


export interface Notification {
  id: string;
  message: string;
  timestamp: string; // ISO String
  read: boolean;
  type: NotificationType;
  link?: {
    page: Page;
    id: string;
  };
}

// Daily Report related types
export enum DailyReportStatus {
    Submitted = 'Submitted',
    Draft = 'Draft',
    Reviewed = 'Reviewed',
    Revision = 'Revision',
}

export interface DailyTask {
    id: string;
    description: string;
    hoursSpent: number;
    attachments: string[];
}

export interface DailyReportHistoryLog {
    id: string;
    timestamp: string;
    user: User;
    action: string;
}

export interface DailyReport {
    id: string;
    userId: string;
    date: string; // YYYY-MM-DD
    status: DailyReportStatus;
    tasks: DailyTask[];
    history?: DailyReportHistoryLog[];
    managerNotes?: string;
}

// General types
export type Page = 
  | 'dashboard'
  | 'projects'
  | 'projectDetail'
  | 'assets'
  | 'documents'
  | 'users'
  | 'userDetail'
  | 'settings'
  | 'gemini'
  | 'departments'
  | 'operational'
  | 'notifications'
  | 'calendar';
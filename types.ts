// FIX: Removed self-import of Page which caused a conflict with the local declaration.
export type Page =
  | 'dashboard'
  | 'operational'
  | 'projects'
  | 'projectDetail'
  | 'assets'
  | 'documents'
  | 'users'
  | 'userDetail'
  | 'departments'
  | 'gemini'
  | 'notifications'
  | 'calendar'
  | 'settings';

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
  department?: string;
  avatarUrl: string;
}

export enum ProjectStatus {
  Pitching = 'Pitching',
  Approved = 'Approved',
  OnProgress = 'On Progress',
  Revision = 'Revision',
  Completed = 'Completed',
  Archived = 'Archived',
}

export enum ExpenseStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface Expense {
  id: string;
  item: string;
  amount: number;
  date: string;
  status: ExpenseStatus;
  receiptFilenames?: string[];
}

export enum TaskPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface ProjectTask {
  id: string;
  title: string;
  assignee: User;
  dueDate: string;
  priority: TaskPriority;
  completed: boolean;
  dependencies?: string[];
}

export interface Vendor {
  id: string;
  name: string;
  service: string;
  contact: string;
}

export interface ProjectHistoryLog {
  id: string;
  timestamp: string;
  user: User;
  action: string;
}

export enum LpjStatus {
  Draft = 'Draft',
  Submitted = 'Submitted',
  Revision = 'Revision',
  Approved = 'Approved',
}

export interface Lpj {
  id: string;
  status: LpjStatus;
  notes: string;
  submittedDate?: string;
  approvedDate?: string;
  financialSummary: {
    totalIncome: number;
    totalExpense: number;
    finalBalance: number;
  };
  attachments: string[]; // filenames
}

export interface Project {
  id: string;
  name: string;
  pic: User;
  startDate: string;
  endDate: string;
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
  lpj?: Lpj;
}

export enum AssetType {
  Permanent = 'Permanent',
  Rent = 'Sewa',
}

export enum AssetStatus {
  Available = 'Available',
  InUse = 'In Use',
  Maintenance = 'Maintenance',
  RentedOut = 'Rented Out',
  Broken = 'Broken',
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  lastMaintenance: string;
  managedBy: User;
  nextMaintenance?: string;
  rentedUntil?: string;
}

export type DocumentCategory = 'Venue' | 'Konsep' | 'Talent' | 'Vendor' | 'MOU & SPK' | 'Invoice & Kuitansi' | 'Legalitas';
export type DocumentFileType = 'PDF' | 'DOCX' | 'JPG';

export interface Document {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory;
  fileType: DocumentFileType;
  version: number;
  lastUpdated: string;
  tags: string[];
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface UserTask {
  id: string;
  userId: string;
  title: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export type NotificationType = 'task_completed' | 'new_project' | 'general';


export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  link?: {
    page: Page;
    id: string;
  };
}

// --- Daily Operational Types ---

export interface DailyTask {
  id: string;
  description: string;
  hoursSpent: number;
  attachments: string[]; // filenames
}

// FIX: Changed from a type alias to an enum so it can be used as a value in mock data.
export enum DailyReportStatus {
  Draft = 'Draft',
  Submitted = 'Submitted',
  Revision = 'Revision',
  Reviewed = 'Reviewed',
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
  tasks: DailyTask[];
  status: DailyReportStatus;
  managerNotes?: string;
  history?: DailyReportHistoryLog[];
}
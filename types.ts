// types.ts

export type Page = 
  | 'dashboard'
  | 'operational'
  | 'projects'
  | 'projectDetail'
  | 'assets'
  | 'documents'
  | 'users'
  | 'userDetail'
  | 'settings'
  | 'gemini'
  | 'departments'
  | 'departmentDetail'
  | 'notifications'
  | 'calendar';

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
  avatarUrl: string;
  department: string;
}

export enum ProjectStatus {
  Pitching = 'Pitching',
  Approved = 'Approved',
  OnProgress = 'On Progress',
  Revision = 'Revision',
  Completed = 'Completed',
  Archived = 'Archived',
}

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

export interface Vendor {
  id: string;
  name: string;
  service: string;
  contact: string;
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
  date: string; // YYYY-MM-DD
  status: ExpenseStatus;
  receiptFilenames?: string[];
}

export interface ProjectHistoryLog {
  id: string;
  timestamp: string; // ISO 8601
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
  submittedDate?: string;
  approvedDate?: string;
  notes?: string;
  revisionNotes?: string;
}

export interface HandoverLog {
    id: string;
    fromPIC: User;
    toPIC: User;
    timestamp: string; // ISO 8601
    confirmationTimestamp?: string; // ISO 8601
    briefing: string;
}

export interface ProjectComment {
    id: string;
    user: User;
    timestamp: string; // ISO 8601
    content: string;
}

export interface UsedAssetLog {
    asset: Asset;
    checkoutDate: string; // ISO 8601
    returnDate?: string; // ISO 8601
}

export interface Project {
  id: string;
  name: string;
  department: string;
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
  lpj?: Lpj;
  handoverHistory?: HandoverLog[];
  comments?: ProjectComment[];
  usedAssets?: UsedAssetLog[];
}

export enum AssetType {
    Permanent = 'Permanent',
    Rent = 'Sewa',
}

export enum AssetStatus {
    Available = 'Tersedia',
    InUse = 'Digunakan',
    Maintenance = 'Maintenance',
    RentedOut = 'Disewakan',
    Broken = 'Rusak',
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  managedBy: User;
  lastMaintenance: string; // YYYY-MM-DD
  nextMaintenance?: string; // YYYY-MM-DD
  rentedUntil?: string; // YYYY-MM-DD
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
  lastUpdated: string; // YYYY-MM-DD
  tags: string[];
}

export interface UserTask {
    id: string;
    userId: string;
    title: string;
    dueDate: string; // YYYY-MM-DD
    priority: TaskPriority;
    status: TaskStatus;
}

export type NotificationType = 'general' | 'task_completed' | 'new_project';

export interface Notification {
    id: string;
    message: string;
    timestamp: string; // ISO 8601
    read: boolean;
    type: NotificationType;
    link?: {
        page: 'projects' | 'users';
        id: string;
    };
}

export interface DailyTask {
    id: string;
    description: string;
    hoursSpent: number;
    attachments: string[];
}

export enum DailyReportStatus {
    Draft = 'Draft',
    Submitted = 'Submitted',
    Revision = 'Revision',
    Reviewed = 'Reviewed',
}

export interface DailyReportHistoryLog {
    id: string;
    timestamp: string; // ISO 8601
    user: User;
    action: string;
}

export interface DailyReport {
    id: string;
    userId: string;
    date: string; // YYYY-MM-DD
    tasks: DailyTask[];
    status: DailyReportStatus;
    history: DailyReportHistoryLog[];
    managerNotes?: string;
}

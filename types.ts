// FIX: Removed a self-import of UserRole that was causing a conflict with the enum declaration below.
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
  department?: string;
}

export enum ProjectStatus {
  OnProgress = 'On Progress',
  Completed = 'Completed',
  Pitching = 'Pitching',
  Approved = 'Approved',
  Revision = 'Revision',
  Archived = 'Archived',
}

export enum ExpenseStatus {
    Approved = 'Disetujui',
    Pending = 'Menunggu Persetujuan',
    Rejected = 'Ditolak',
}

export interface Expense {
  id: string;
  item: string;
  amount: number;
  date: string;
  status: ExpenseStatus;
  receiptFilenames?: string[];
  originalData?: Partial<Expense>;
}

export interface ProjectTask {
  id: string;
  title: string;
  assignee: User;
  completed: boolean;
  dueDate: string;
  priority: TaskPriority;
  dependencies?: string[];
}

export interface ProjectHistoryLog {
    id: string;
    timestamp: string;
    user: User;
    action: string;
}

export interface Vendor {
  id: string;
  name: string;
  service: string;
  contact: string;
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
  history?: ProjectHistoryLog[];
}

export enum AssetStatus {
  Available = 'Available',
  InUse = 'In Use',
  Maintenance = 'Maintenance',
  RentedOut = 'Rented Out',
  Broken = 'Broken',
}

export enum AssetType {
  Liquid = 'Liquid',
  Permanent = 'Permanent',
  Rent = 'Rent',
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  lastMaintenance: string;
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

export enum TaskPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface UserTask {
  id: string;
  userId: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  priority: TaskPriority;
}
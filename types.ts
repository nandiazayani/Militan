export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  Staff = 'Staff',
  AssetManager = 'Asset Manager'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  department?: string;
}

export enum AssetType {
  Liquid = 'Liquid Asset',
  Permanent = 'Permanent Asset',
  Rent = 'Rent Asset'
}

export enum AssetStatus {
  Available = 'Available',
  InUse = 'In Use',
  Maintenance = 'Maintenance',
  RentedOut = 'Rented Out',
  Broken = 'Broken'
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

export enum ProjectStatus {
  Pitching = 'Pitching',
  Approved = 'Approved',
  OnProgress = 'On Progress',
  Revision = 'Revisi/Perbaikan',
  Completed = 'Selesai',
  Archived = 'Arsip'
}

export interface TeamMember {
  user: User;
  position: string;
  progress: number; // 0-100
}

export interface Vendor {
    id: string;
    name: string;
    status: 'Paid' | 'Pending' | 'Overdue';
}

export type ProjectTaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface ProjectTask {
    id: string;
    title: string;
    assignee: User;
    status: ProjectTaskStatus;
    dueDate: string;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  pic: User;
  team: TeamMember[];
  budget: {
    modal: number;
    pengeluaran: number;
    pemasukan: number;
  };
  vendors: Vendor[];
  tasks?: ProjectTask[];
  reportUrl?: string;
  startDate: string;
  endDate: string;
}

export interface Document {
    id: string;
    name: string;
    description?: string;
    category: 'Venue' | 'Konsep' | 'Talent' | 'Vendor' | 'MOU & SPK' | 'Invoice & Kuitansi' | 'Legalitas';
    version: number;
    lastUpdated: string;
    fileType: 'PDF' | 'DOCX' | 'JPG';
    tags: string[];
}

export interface UserTask {
    id: string;
    userId: string;
    title: string;
    status: 'To Do' | 'In Progress' | 'Done';
    dueDate: string;
}
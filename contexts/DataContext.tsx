import { createContext } from 'react';
import { User, Project, Asset, Document as Doc, UserTask, Notification, NotificationType, DailyReport } from '../types';

export interface DataContextType {
  allUsers: User[];
  allProjects: Project[];
  allAssets: Asset[];
  allDocuments: Doc[];
  allUserTasks: UserTask[];
  allNotifications: Notification[];
  allDailyReports: DailyReport[];
  updateUser: (user: User) => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  addAsset: (asset: Asset) => Promise<void>;
  updateAsset: (asset: Asset) => Promise<void>;
  deleteAsset: (assetId: string) => Promise<void>;
  addDocument: (doc: Doc) => Promise<void>;
  updateDocument: (doc: Doc) => Promise<void>;
  deleteDocument: (docId: string) => Promise<void>;
  addUser: (user: User) => Promise<void>;
  addUserTask: (task: UserTask) => Promise<void>;
  updateUserTask: (task: UserTask) => Promise<void>;
  deleteUserTask: (taskId: string) => Promise<void>;
  addNotification: (type: NotificationType, message: string, link?: Notification['link']) => void;
  markNotificationsAsRead: () => void;
  addDailyReport: (report: DailyReport) => Promise<void>;
  updateDailyReport: (report: DailyReport) => Promise<void>;
}

export const DataContext = createContext<DataContextType | null>(null);

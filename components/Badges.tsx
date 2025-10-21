import React from 'react';
import { TaskPriority, ProjectStatus, ExpenseStatus, UserRole, AssetStatus, UserTask, LpjStatus } from '../types';

/**
 * A visually distinct badge for displaying task priority with corresponding icons and colors.
 * High: Red with an up-arrow icon.
 * Medium: Yellow with a minus icon.
 * Low: Gray with a down-arrow icon.
 */
export const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
    const priorityStyles: Record<TaskPriority, { bg: string; text: string; icon: React.ReactNode }> = {
        [TaskPriority.High]: { 
            bg: 'bg-red-900/30', 
            text: 'text-red-300', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" /></svg>
        },
        [TaskPriority.Medium]: { 
            bg: 'bg-yellow-800/30', 
            text: 'text-yellow-300', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" /></svg>
        },
        [TaskPriority.Low]: { 
            bg: 'bg-gray-700/50', 
            text: 'text-gray-300', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" /></svg>
        },
    };
    const style = priorityStyles[priority];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full ${style.bg} ${style.text}`}>
            {style.icon}
            <span>{priority}</span>
        </span>
    );
};

export const ProjectStatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const statusStyles = {
    [ProjectStatus.OnProgress]: 'bg-blue-900/50 text-blue-300',
    [ProjectStatus.Completed]: 'bg-green-900/50 text-green-300',
    [ProjectStatus.Pitching]: 'bg-yellow-800/50 text-yellow-300',
    [ProjectStatus.Approved]: 'bg-indigo-900/50 text-indigo-300',
    [ProjectStatus.Revision]: 'bg-orange-800/50 text-orange-300',
    [ProjectStatus.Archived]: 'bg-gray-700/50 text-gray-300',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-700/50 text-gray-300'}`}>
      {status}
    </span>
  );
};

export const ExpenseStatusBadge: React.FC<{ status: ExpenseStatus }> = ({ status }) => {
    const statusStyles: Record<ExpenseStatus, string> = {
        [ExpenseStatus.Approved]: 'bg-green-900/50 text-green-300',
        [ExpenseStatus.Pending]: 'bg-yellow-800/50 text-yellow-300',
        [ExpenseStatus.Rejected]: 'bg-red-900/50 text-red-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
    const roleColors: Record<UserRole, string> = {
        [UserRole.Admin]: 'bg-red-900/50 text-red-300',
        [UserRole.Manager]: 'bg-indigo-900/50 text-indigo-300',
        [UserRole.Staff]: 'bg-blue-900/50 text-blue-300',
        [UserRole.AssetManager]: 'bg-yellow-800/50 text-yellow-300',
        [UserRole.Finance]: 'bg-teal-900/50 text-teal-300',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleColors[role]}`}>{role}</span>
}

export const AssetStatusBadge: React.FC<{ status: AssetStatus }> = ({ status }) => {
    const statusStyles: Record<AssetStatus, string> = {
        [AssetStatus.Available]: 'bg-green-900/50 text-green-300',
        [AssetStatus.InUse]: 'bg-blue-900/50 text-blue-300',
        [AssetStatus.Maintenance]: 'bg-yellow-800/50 text-yellow-300',
        [AssetStatus.RentedOut]: 'bg-indigo-900/50 text-indigo-300',
        [AssetStatus.Broken]: 'bg-red-900/50 text-red-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-700/50 text-gray-300'}`}>
            {status}
        </span>
    );
};

export const TaskStatusBadge: React.FC<{ status: UserTask['status'] }> = ({ status }) => {
    const colorMap = {
        'To Do': 'bg-gray-600 text-gray-100',
        'In Progress': 'bg-blue-800/80 text-blue-200',
        'Done': 'bg-green-800/80 text-green-200',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorMap[status]}`}>{status}</span>;
}

export const LpjStatusBadge: React.FC<{ status: LpjStatus }> = ({ status }) => {
  const statusStyles: Record<LpjStatus, string> = {
    [LpjStatus.Draft]: 'bg-gray-700 text-gray-300',
    [LpjStatus.Submitted]: 'bg-blue-900/50 text-blue-300',
    [LpjStatus.Revision]: 'bg-orange-800/50 text-orange-300',
    [LpjStatus.Approved]: 'bg-green-900/50 text-green-300',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};
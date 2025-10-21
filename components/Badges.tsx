import React from 'react';
import { TaskPriority, ProjectStatus, ExpenseStatus, UserRole, AssetStatus, UserTask } from '../types';

/**
 * A visually distinct badge for displaying task priority with corresponding icons and colors.
 * High: Red with an up-arrow icon.
 * Medium: Yellow with a minus icon.
 * Low: Gray with a down-arrow icon.
 */
export const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
    const priorityStyles: Record<TaskPriority, { bg: string; text: string; icon: React.ReactNode }> = {
        [TaskPriority.High]: { 
            bg: 'bg-red-100 dark:bg-red-900/30', 
            text: 'text-red-700 dark:text-red-300', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" /></svg>
        },
        [TaskPriority.Medium]: { 
            bg: 'bg-yellow-100 dark:bg-yellow-800/30', 
            text: 'text-yellow-700 dark:text-yellow-300', 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" /></svg>
        },
        [TaskPriority.Low]: { 
            bg: 'bg-gray-100 dark:bg-gray-700/50', 
            text: 'text-gray-700 dark:text-gray-300', 
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
    [ProjectStatus.OnProgress]: 'bg-blue-100 text-blue-800',
    [ProjectStatus.Completed]: 'bg-green-100 text-green-800',
    [ProjectStatus.Pitching]: 'bg-yellow-100 text-yellow-800',
    [ProjectStatus.Approved]: 'bg-indigo-100 text-indigo-800',
    [ProjectStatus.Revision]: 'bg-orange-100 text-orange-800',
    [ProjectStatus.Archived]: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

export const ExpenseStatusBadge: React.FC<{ status: ExpenseStatus }> = ({ status }) => {
    const statusStyles: Record<ExpenseStatus, string> = {
        [ExpenseStatus.Approved]: 'bg-green-100 text-green-800',
        [ExpenseStatus.Pending]: 'bg-yellow-100 text-yellow-800',
        [ExpenseStatus.Rejected]: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
    const roleColors: Record<UserRole, string> = {
        [UserRole.Admin]: 'bg-red-100 text-red-800',
        [UserRole.Manager]: 'bg-indigo-100 text-indigo-800',
        [UserRole.Staff]: 'bg-blue-100 text-blue-800',
        [UserRole.AssetManager]: 'bg-yellow-100 text-yellow-800',
        [UserRole.Finance]: 'bg-teal-100 text-teal-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleColors[role]}`}>{role}</span>
}

export const AssetStatusBadge: React.FC<{ status: AssetStatus }> = ({ status }) => {
    const statusStyles: Record<AssetStatus, string> = {
        [AssetStatus.Available]: 'bg-green-100 text-green-800',
        [AssetStatus.InUse]: 'bg-blue-100 text-blue-800',
        [AssetStatus.Maintenance]: 'bg-yellow-100 text-yellow-800',
        [AssetStatus.RentedOut]: 'bg-indigo-100 text-indigo-800',
        [AssetStatus.Broken]: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

export const TaskStatusBadge: React.FC<{ status: UserTask['status'] }> = ({ status }) => {
    const colorMap = {
        'To Do': 'bg-gray-200 text-gray-800',
        'In Progress': 'bg-blue-200 text-blue-800',
        'Done': 'bg-green-200 text-green-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorMap[status]}`}>{status}</span>;
}

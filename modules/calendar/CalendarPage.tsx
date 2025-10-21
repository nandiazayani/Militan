import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../../contexts/DataContext';
// FIX: Corrected import path for types
import { Project, UserTask } from '../../types';

interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    type: 'project-start' | 'project-end' | 'task';
    color: 'green' | 'blue';
    linkId: string;
    onClick: () => void;
}

const CalendarPage: React.FC<{
    onSelectProject: (projectId: string) => void;
    onSelectUser: (userId: string) => void;
}> = ({ onSelectProject, onSelectUser }) => {
    const dataContext = useContext(DataContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const { allProjects, allUserTasks } = dataContext!;

    const events = useMemo(() => {
        const calendarEvents: CalendarEvent[] = [];
        
        allProjects.forEach(project => {
            calendarEvents.push({
                id: `${project.id}-start`,
                title: `${project.name} (Mulai)`,
                date: project.startDate,
                type: 'project-start',
                color: 'green',
                linkId: project.id,
                onClick: () => onSelectProject(project.id)
            });
            calendarEvents.push({
                id: `${project.id}-end`,
                title: `${project.name} (Selesai)`,
                date: project.endDate,
                type: 'project-end',
                color: 'green',
                linkId: project.id,
                onClick: () => onSelectProject(project.id)
            });
        });

        allUserTasks.forEach(task => {
            calendarEvents.push({
                id: task.id,
                title: task.title,
                date: task.dueDate,
                type: 'task',
                color: 'blue',
                linkId: task.userId,
                onClick: () => onSelectUser(task.userId)
            });
        });

        return calendarEvents;
    }, [allProjects, allUserTasks, onSelectProject, onSelectUser]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };
    
    const jumpToToday = () => {
        setCurrentDate(new Date());
    };

    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    
    // FIX: Create a timezone-safe function to format date to YYYY-MM-DD string to avoid off-by-one errors.
    const toLocalISOString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayStr = useMemo(() => toLocalISOString(new Date()), []);


    return (
        <div className="bg-surface rounded-xl shadow-lg p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-text-primary">Kalender Tim</h2>
                <div className="flex items-center gap-4">
                     <span className="text-lg font-semibold w-36 text-center">
                        {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                    </span>
                    <div className="flex items-center border border-gray-600 rounded-lg">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-700 rounded-l-md border-r border-gray-600"><ChevronLeftIcon /></button>
                        <button onClick={jumpToToday} className="px-4 py-1.5 text-sm font-semibold hover:bg-gray-700 transition">Hari Ini</button>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-700 rounded-r-md border-l border-gray-600"><ChevronRightIcon /></button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-sm text-gray-400 mb-2">
                {dayNames.map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 gap-1 flex-grow">
                {days.map((d, i) => {
                    const dateStr = toLocalISOString(d); // FIX: Use the timezone-safe function
                    const eventsForDay = events.filter(e => e.date === dateStr);
                    const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                    const isToday = todayStr === dateStr;

                    return (
                        <div key={i} className={`p-2 border border-gray-700/50 rounded-md flex flex-col ${isCurrentMonth ? 'bg-surface' : 'bg-gray-800/50'}`}>
                            <span className={`font-bold text-xs mb-1 ${isToday ? 'bg-primary text-black rounded-full w-5 h-5 flex items-center justify-center' : ''}`}>
                                {d.getDate()}
                            </span>
                            <div className="flex-grow overflow-y-auto space-y-1 text-left">
                                {eventsForDay.map(event => (
                                    <div 
                                        key={event.id}
                                        onClick={() => event.onClick()}
                                        className={`px-1.5 py-0.5 text-xs rounded-md cursor-pointer truncate ${event.color === 'green' ? 'bg-green-900/50 text-green-300' : 'bg-blue-900/50 text-blue-300'}`}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ChevronLeftIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>;
const ChevronRightIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;

export default CalendarPage;
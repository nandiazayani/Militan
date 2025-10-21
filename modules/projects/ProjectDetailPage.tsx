import React, { useContext, useState, useEffect, useMemo } from 'react';
import { DataContext, UserContext } from '../../App';
import { Project, Expense, ProjectTask, Vendor, ProjectHistoryLog, UserRole, Lpj, LpjStatus, ProjectStatus } from '../../types';

import ProjectHeader from '../../components/projects/ProjectHeader';
import ProjectOverview from '../../components/projects/ProjectOverview';
import TeamCard from '../../components/projects/TeamCard';
import VendorCard from '../../components/projects/VendorCard';
import TaskCard from '../../components/projects/TaskCard';
import ExpenseCard from '../../components/projects/ExpenseCard';
import HistoryCard from '../../components/projects/HistoryCard';
import LpjCard from '../../components/projects/LpjCard';
import GeminiProjectAssistant from '../../components/projects/GeminiProjectAssistant';

import ExpenseModal from './modals/ExpenseModal';
import VendorModal from './modals/VendorModal';
import TaskModal from './modals/TaskModal';
import LpjModal from './modals/LpjModal';

interface ProjectDetailPageProps {
    projectId: string;
    onBack: () => void;
    onSelectUser: (userId: string) => void;
    setHasUnsavedChanges: (hasChanges: boolean) => void;
}

type ActiveModal = {
    type: 'expense' | 'vendor' | 'task' | 'lpj' | null;
    data?: Expense | Vendor | ProjectTask | Lpj | null;
};

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId, onBack, onSelectUser, setHasUnsavedChanges }) => {
    const dataContext = useContext(DataContext);
    const userContext = useContext(UserContext);

    const [project, setProject] = useState<Project | null>(null);
    const [originalProject, setOriginalProject] = useState<Project | null>(null);
    const [activeModal, setActiveModal] = useState<ActiveModal>({ type: null, data: null });

    const isDirty = useMemo(() => {
        return JSON.stringify(project) !== JSON.stringify(originalProject);
    }, [project, originalProject]);

    useEffect(() => {
        setHasUnsavedChanges(isDirty);
    }, [isDirty, setHasUnsavedChanges]);

    useEffect(() => {
        const foundProject = dataContext?.allProjects.find(p => p.id === projectId);
        if (foundProject) {
            const projectCopy = JSON.parse(JSON.stringify(foundProject));
            setProject(projectCopy);
            setOriginalProject(JSON.parse(JSON.stringify(foundProject)));
        }
    }, [projectId, dataContext?.allProjects]);
    
    if (!dataContext || !userContext) return <div>Loading Context...</div>;
    const { updateProject } = dataContext;
    const { user: currentUser } = userContext;
    if (!project || !originalProject) return <div>Loading Project...</div>;

    const canEditProject = currentUser.role === UserRole.Admin || currentUser.role === UserRole.Manager || project.pic.id === currentUser.id;

    const createHistoryLog = (action: string): ProjectHistoryLog => ({
        id: `h-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: currentUser,
        action,
    });

    const handleBack = () => {
        if (isDirty) {
            if (window.confirm('Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin keluar?')) {
                onBack();
            }
        } else {
            onBack();
        }
    };
    
    const handleSaveChanges = () => {
        if (project) {
            updateProject(project);
            setOriginalProject(JSON.parse(JSON.stringify(project)));
            alert('Perubahan disimpan!');
        }
    };

    const updateProjectState = (updater: (prev: Project) => Partial<Project>, log?: ProjectHistoryLog) => {
        setProject(prev => {
            if (!prev) return null;
            const updates = updater(prev);
            const newHistory = log ? [log, ...(prev.history || [])] : prev.history;
            return { ...prev, ...updates, history: newHistory };
        });
    };

    const handleSaveTask = (savedTask: ProjectTask) => {
        const isEditing = project.tasks.some(t => t.id === savedTask.id);
        const log = createHistoryLog(isEditing ? `Memperbarui tugas: "${savedTask.title}".` : `Menambahkan tugas baru: "${savedTask.title}".`);
        updateProjectState(prev => ({
            tasks: isEditing ? prev.tasks.map(t => (t.id === savedTask.id ? savedTask : t)) : [savedTask, ...prev.tasks]
        }), log);
        setActiveModal({ type: null });
    };

    const handleSaveExpense = (savedExpense: Expense) => {
        const isEditing = project.expenses.some(e => e.id === savedExpense.id);
        const log = createHistoryLog(isEditing ? `Memperbarui pengeluaran: "${savedExpense.item}".` : `Menambahkan pengeluaran: "${savedExpense.item}".`);
        updateProjectState(prev => ({
            expenses: isEditing ? prev.expenses.map(e => (e.id === savedExpense.id ? savedExpense : e)) : [savedExpense, ...prev.expenses]
        }), log);
        setActiveModal({ type: null });
    };

    const handleSaveVendor = (savedVendor: Vendor) => {
        const isEditing = project.vendors.some(v => v.id === savedVendor.id);
        const log = createHistoryLog(isEditing ? `Memperbarui vendor: "${savedVendor.name}".` : `Menambahkan vendor: "${savedVendor.name}".`);
        updateProjectState(prev => ({
            vendors: isEditing ? prev.vendors.map(v => (v.id === savedVendor.id ? savedVendor : v)) : [savedVendor, ...prev.vendors]
        }), log);
        setActiveModal({ type: null });
    };
    
    const handleSaveLpj = (savedLpj: Lpj) => {
        const isEditing = !!project.lpj;
        const logAction = savedLpj.status === LpjStatus.Submitted && project.lpj?.status !== LpjStatus.Submitted
            ? 'Mengajukan Laporan Pertanggungjawaban untuk direview.'
            : isEditing ? 'Memperbarui draf Laporan Pertanggungjawaban.' : 'Membuat draf Laporan Pertanggungjawaban.';
        const log = createHistoryLog(logAction);
        
        const lpjToSave = { ...savedLpj };
        if (savedLpj.status === LpjStatus.Submitted && !isEditing) {
            lpjToSave.submittedDate = new Date().toISOString().split('T')[0];
        }
        
        updateProjectState(() => ({ lpj: lpjToSave }), log);
        setActiveModal({ type: null });
    };

    const openModal = (type: ActiveModal['type'], data: ActiveModal['data'] = null) => {
        setActiveModal({ type, data });
    };

    return (
        <div className="space-y-6">
            <ProjectHeader project={project} onBack={handleBack} onSave={handleSaveChanges} canEdit={canEditProject} />

            <ProjectOverview project={project} onSelectUser={onSelectUser} />

            <GeminiProjectAssistant project={project} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <TeamCard team={[project.pic, ...project.team]} onSelectUser={onSelectUser} />
                    <VendorCard vendors={project.vendors} onOpenModal={openModal} canEdit={canEditProject} />
                </div>
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <TaskCard tasks={project.tasks} onOpenModal={openModal} onUpdateProject={updateProjectState} createHistoryLog={createHistoryLog} canEdit={canEditProject}/>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ExpenseCard 
                        expenses={project.expenses} 
                        projectName={project.name}
                        onOpenModal={openModal} 
                        onUpdateProject={updateProjectState} 
                        createHistoryLog={createHistoryLog} 
                        canEdit={canEditProject} 
                    />
                </div>
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <HistoryCard history={project.history} />
                    <LpjCard 
                        project={project} 
                        onOpenModal={() => openModal('lpj', project.lpj)} 
                        onUpdateProject={updateProjectState} 
                        createHistoryLog={createHistoryLog} 
                    />
                </div>
            </div>

            {activeModal.type === 'expense' && (
                <ExpenseModal
                    isOpen={true}
                    onClose={() => setActiveModal({ type: null })}
                    onSave={handleSaveExpense}
                    expense={activeModal.data as Expense | null}
                />
            )}
            {activeModal.type === 'vendor' && (
                <VendorModal
                    isOpen={true}
                    onClose={() => setActiveModal({ type: null })}
                    onSave={handleSaveVendor}
                    vendor={activeModal.data as Vendor | null}
                />
            )}
            {activeModal.type === 'task' && (
                <TaskModal
                    isOpen={true}
                    onClose={() => setActiveModal({ type: null })}
                    onSave={handleSaveTask}
                    task={activeModal.data as ProjectTask | null}
                    projectTeam={[project.pic, ...project.team]}
                    allTasks={project.tasks}
                />
            )}
             {activeModal.type === 'lpj' && (
                <LpjModal
                    isOpen={true}
                    onClose={() => setActiveModal({ type: null })}
                    onSave={handleSaveLpj}
                    project={project}
                />
            )}
        </div>
    );
};

export default ProjectDetailPage;
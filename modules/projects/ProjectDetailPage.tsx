import React, { useContext, useState, useMemo, useCallback } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { UserContext } from '../../contexts/UserContext';
import { Project, User, UserRole, ProjectTask, Vendor, Expense, ProjectHistoryLog, UsedAssetLog, Asset, ProjectComment, HandoverLog, LpjStatus } from '../../types';

// Import Components
import ProjectHeader from '../../components/projects/ProjectHeader';
import ProjectOverview from '../../components/projects/ProjectOverview';
import TeamCard from '../../components/projects/TeamCard';
import VendorCard from '../../components/projects/VendorCard';
import TaskCard from '../../components/projects/TaskCard';
import ExpenseCard from '../../components/projects/ExpenseCard';
import HistoryCard from '../../components/projects/HistoryCard';
import LpjCard from '../../components/projects/LpjCard';
import GeminiProjectAssistant from '../../components/projects/GeminiProjectAssistant';
import ProjectAssetLogCard from '../../components/projects/ProjectAssetLogCard';
import CommentCard from '../../components/projects/CommentCard';
import HandoverHistoryCard from '../../components/projects/HandoverHistoryCard';


// Import Modals
import TaskModal from './modals/TaskModal';
import VendorModal from './modals/VendorModal';
import ExpenseModal from './modals/ExpenseModal';
import LpjModal from './modals/LpjModal';
import LpjRevisionModal from './modals/LpjRevisionModal';
import HandoverModal from './modals/HandoverModal';
import CheckoutAssetModal from './modals/CheckoutAssetModal';


interface ProjectDetailPageProps {
    projectId: string;
    onBack: () => void;
    onSelectUser: (userId: string) => void;
    setHasUnsavedChanges: (hasChanges: boolean) => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId, onBack, onSelectUser, setHasUnsavedChanges }) => {
    const dataContext = useContext(DataContext);
    const userContext = useContext(UserContext);

    const [modalState, setModalState] = useState<{ type: string | null, data: any | null }>({ type: null, data: null });

    const project = useMemo(() => {
        return dataContext?.allProjects.find(p => p.id === projectId);
    }, [dataContext?.allProjects, projectId]);

    const { user: currentUser } = userContext!;
    const { allUsers, allAssets, updateProject, addNotification, updateAsset } = dataContext!;

    const canEdit = currentUser.role === UserRole.Admin || currentUser.role === UserRole.Manager || currentUser.id === project?.pic.id;
    const canInitiateHandover = currentUser.role === UserRole.Admin || currentUser.id === project?.pic.id;

    const createHistoryLog = useCallback((action: string): ProjectHistoryLog => ({
        id: `h${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: currentUser,
        action: action,
    }), [currentUser]);

    const handleUpdateProject = useCallback((updater: (prev: Project) => Partial<Project>, log?: ProjectHistoryLog) => {
        if (!project) return;
        const updates = updater(project);
        const newHistory = log ? [...(project.history || []), log] : project.history;
        updateProject({ ...project, ...updates, history: newHistory });
        setHasUnsavedChanges(true); // Assuming local state management for this demo
    }, [project, updateProject, setHasUnsavedChanges]);
    
    const handleSave = () => {
        alert("Perubahan disimpan!"); // Placeholder for actual save logic
        setHasUnsavedChanges(false);
    };

    const handleOpenModal = (type: string, data: any = null) => {
        setModalState({ type, data });
    };

    const handleCloseModal = () => {
        setModalState({ type: null, data: null });
    };

    const handleSaveTask = (savedTask: ProjectTask) => {
        const isEditing = project?.tasks.some(t => t.id === savedTask.id);
        const log = createHistoryLog(isEditing ? `memperbarui tugas "${savedTask.title}".` : `menambahkan tugas baru "${savedTask.title}".`);
        handleUpdateProject(
            prev => ({
                tasks: isEditing
                    ? prev.tasks.map(t => t.id === savedTask.id ? savedTask : t)
                    : [...prev.tasks, savedTask]
            }),
            log
        );
        handleCloseModal();
    };

    const handleSaveVendor = (savedVendor: Vendor) => {
        const isEditing = project?.vendors.some(v => v.id === savedVendor.id);
        const log = createHistoryLog(isEditing ? `memperbarui vendor "${savedVendor.name}".` : `menambahkan vendor baru "${savedVendor.name}".`);
        handleUpdateProject(
            prev => ({
                vendors: isEditing
                    ? prev.vendors.map(v => v.id === savedVendor.id ? savedVendor : v)
                    : [...prev.vendors, savedVendor]
            }),
            log
        );
        handleCloseModal();
    };
    
    const handleSaveExpense = (savedExpense: Expense) => {
        const isEditing = project?.expenses.some(e => e.id === savedExpense.id);
         const log = createHistoryLog(isEditing ? `memperbarui pengeluaran "${savedExpense.item}".` : `menambahkan pengeluaran baru "${savedExpense.item}".`);
        handleUpdateProject(
            prev => ({
                expenses: isEditing
                    ? prev.expenses.map(e => e.id === savedExpense.id ? savedExpense : e)
                    : [...prev.expenses, savedExpense]
            }),
            log
        );
        handleCloseModal();
    };
    
    const handleSaveLpj = (notes: string) => {
        const log = createHistoryLog(`mengirimkan LPJ untuk direview.`);
        handleUpdateProject(prev => ({
            lpj: { ...(prev.lpj!), status: LpjStatus.Submitted, submittedDate: new Date().toISOString(), notes }
        }), log);
        addNotification('general', `${currentUser.name} telah mengirimkan LPJ untuk proyek "${project?.name}".`, { page: 'projects', id: project!.id });
        handleCloseModal();
    };

    const handleLpjRevision = (revisionNotes: string) => {
        const log = createHistoryLog(`meminta revisi untuk LPJ.`);
        handleUpdateProject(prev => ({
            lpj: { ...(prev.lpj!), status: LpjStatus.Revision, revisionNotes }
        }), log);
        addNotification('general', `Manajer meminta revisi untuk LPJ proyek "${project?.name}".`, { page: 'projects', id: project!.id });
        handleCloseModal();
    };

    const handleApproveLpj = () => {
        const log = createHistoryLog(`menyetujui LPJ.`);
        handleUpdateProject(prev => ({
            lpj: { ...(prev.lpj!), status: LpjStatus.Approved, approvedDate: new Date().toISOString() }
        }), log);
        addNotification('general', `LPJ untuk proyek "${project?.name}" telah disetujui.`, { page: 'projects', id: project!.id });
        handleCloseModal();
    };
    
    const handleSaveHandover = (newPIC: User, briefingContent: string) => {
        const log: HandoverLog = {
            id: `ho-${Date.now()}`,
            fromPIC: project!.pic,
            toPIC: newPIC,
            timestamp: new Date().toISOString(),
            briefing: briefingContent,
        };
        const historyLog = createHistoryLog(`memulai serah terima PIC dari ${project!.pic.name} kepada ${newPIC.name}.`);
        handleUpdateProject(prev => ({
            handoverHistory: [...(prev.handoverHistory || []), log]
        }), historyLog);
        addNotification('general', `${project!.pic.name} memulai serah terima proyek "${project!.name}" kepada Anda.`, { page: 'projects', id: project!.id });
        handleCloseModal();
    };
    
    const handleAddComment = (content: string) => {
        const newComment: ProjectComment = {
            id: `c-${Date.now()}`,
            user: currentUser,
            timestamp: new Date().toISOString(),
            content: content
        };
        handleUpdateProject(prev => ({ comments: [...(prev.comments || []), newComment] }));
    };

    const handleCheckoutAsset = (asset: Asset) => {
        const newLog: UsedAssetLog = {
            asset,
            checkoutDate: new Date().toISOString()
        };
        const historyLog = createHistoryLog(`menggunakan aset "${asset.name}" untuk proyek.`);
        handleUpdateProject(prev => ({
            usedAssets: [...(prev.usedAssets || []), newLog]
        }), historyLog);
        // Also update asset status globally
        updateAsset({ ...asset, status: 'Digunakan' });
        handleCloseModal();
    };


    if (!project) {
        return <div className="text-center p-8"><h2 className="text-xl text-red-500">Proyek tidak ditemukan.</h2><button onClick={onBack} className="mt-4 px-4 py-2 bg-primary text-black rounded-lg">Kembali</button></div>;
    }

    return (
        <div className="space-y-6">
            <ProjectHeader project={project} onBack={onBack} onSave={handleSave} canEdit={canEdit} />
            <ProjectOverview project={project} onSelectUser={onSelectUser} onHandoverClick={() => handleOpenModal('handover')} canInitiateHandover={canInitiateHandover} />
            <GeminiProjectAssistant project={project} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                   <TeamCard team={project.team} onSelectUser={onSelectUser} />
                   <VendorCard vendors={project.vendors} onOpenModal={handleOpenModal} canEdit={canEdit} />
                   <LpjCard lpj={project.lpj} canEdit={canEdit} onOpenLpjModal={() => handleOpenModal('lpj')} onOpenRevisionModal={() => handleOpenModal('lpjRevision')} />
                   <ProjectAssetLogCard 
                        usedAssets={project.usedAssets || []}
                        onCheckoutAsset={() => handleOpenModal('checkoutAsset')}
                        onUpdateProject={handleUpdateProject}
                        createHistoryLog={createHistoryLog}
                        canEdit={canEdit}
                   />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <TaskCard tasks={project.tasks} onOpenModal={handleOpenModal} onUpdateProject={handleUpdateProject} createHistoryLog={createHistoryLog} canEdit={canEdit}/>
                    <CommentCard comments={project.comments || []} onAddComment={handleAddComment} />
                </div>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <ExpenseCard expenses={project.expenses} projectName={project.name} onOpenModal={handleOpenModal} onUpdateProject={handleUpdateProject} createHistoryLog={createHistoryLog} canEdit={canEdit}/>
                 <div className="lg:col-span-1 space-y-6">
                    <HistoryCard history={project.history} />
                    <HandoverHistoryCard handoverHistory={project.handoverHistory || []} />
                 </div>
            </div>

            {/* Modals */}
            <TaskModal isOpen={modalState.type === 'task'} onClose={handleCloseModal} onSave={handleSaveTask} task={modalState.data} projectTeam={project.team} allTasks={project.tasks} />
            <VendorModal isOpen={modalState.type === 'vendor'} onClose={handleCloseModal} onSave={handleSaveVendor} vendor={modalState.data} />
            <ExpenseModal isOpen={modalState.type === 'expense'} onClose={handleCloseModal} onSave={handleSaveExpense} expense={modalState.data} />
            <LpjModal isOpen={modalState.type === 'lpj'} onClose={handleCloseModal} onSave={handleSaveLpj} project={project} />
            <LpjRevisionModal isOpen={modalState.type === 'lpjRevision'} onClose={handleCloseModal} onSaveRevision={handleLpjRevision} onApprove={handleApproveLpj} project={project} />
            <HandoverModal isOpen={modalState.type === 'handover'} onClose={handleCloseModal} onSave={handleSaveHandover} project={project} allUsers={allUsers} />
            <CheckoutAssetModal isOpen={modalState.type === 'checkoutAsset'} onClose={handleCloseModal} onCheckout={handleCheckoutAsset} allAssets={allAssets} />
        </div>
    );
};

export default ProjectDetailPage;

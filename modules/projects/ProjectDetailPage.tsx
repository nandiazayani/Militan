import React, { useContext, useState, useMemo, useCallback } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { UserContext } from '../../contexts/UserContext';
import { Project, User, Vendor, Expense, ProjectTask, UserRole, ProjectHistoryLog, Lpj, UsedAssetLog, Asset, AssetStatus, HandoverLog } from '../../types';

import ProjectHeader from '../../components/projects/ProjectHeader';
import ProjectOverview from '../../components/projects/ProjectOverview';
import TeamCard from '../../components/projects/TeamCard';
import VendorCard from '../../components/projects/VendorCard';
import TaskCard from '../../components/projects/TaskCard';
import ExpenseCard from '../../components/projects/ExpenseCard';
import HistoryCard from '../../components/projects/HistoryCard';
import HandoverHistoryCard from '../../components/projects/HandoverHistoryCard';
import LpjCard from '../../components/projects/LpjCard';
import GeminiProjectAssistant from '../../components/projects/GeminiProjectAssistant';
import ProjectAssetLogCard from '../../components/projects/ProjectAssetLogCard';

import VendorModal from './modals/VendorModal';
import ExpenseModal from './modals/ExpenseModal';
import TaskModal from './modals/TaskModal';
import LpjModal from './modals/LpjModal';
import CheckoutAssetModal from './modals/CheckoutAssetModal';
import HandoverModal from './modals/HandoverModal';


interface ProjectDetailPageProps {
    projectId: string;
    onBack: () => void;
    onSelectUser: (userId: string) => void;
    setHasUnsavedChanges: (hasChanges: boolean) => void;
}

type ModalType = 'vendor' | 'expense' | 'task' | 'lpj' | 'checkoutAsset' | 'handover';

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId, onBack, onSelectUser, setHasUnsavedChanges }) => {
    const dataContext = useContext(DataContext);
    const userContext = useContext(UserContext);

    const [modalState, setModalState] = useState<{ type: ModalType | null; data: any | null }>({ type: null, data: null });

    const project = useMemo(() => {
        return dataContext?.allProjects.find(p => p.id === projectId);
    }, [dataContext?.allProjects, projectId]);
    
    const { user: currentUser } = userContext!;
    
    const pendingHandover = useMemo(() => {
        if (!project || !project.handoverHistory) return null;
        return project.handoverHistory.find(h => h.toPIC.id === currentUser.id && !h.confirmationTimestamp);
    }, [project, currentUser]);


    if (!dataContext || !userContext || !project) {
        return <div>Loading project details... or project not found.</div>;
    }
    const { updateProject, allUsers, addNotification, allAssets, updateAsset } = dataContext;

    const canEdit = currentUser.role === UserRole.Admin || currentUser.role === UserRole.Manager || project.pic.id === currentUser.id;
    const canInitiateHandover = canEdit;

    const createHistoryLog = useCallback((action: string): ProjectHistoryLog => ({
        id: `h-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: currentUser,
        action: action
    }), [currentUser]);

    const handleUpdateProject = useCallback((updater: (prev: Project) => Partial<Project>, log?: ProjectHistoryLog) => {
        const updatedFields = updater(project);
        const newHistory = log ? [log, ...project.history] : project.history;
        updateProject({ ...project, ...updatedFields, history: newHistory });
    }, [project, updateProject]);
    
    const handleOpenModal = (type: ModalType, data: any = null) => {
        setModalState({ type, data });
    };

    const handleCloseModal = () => {
        setModalState({ type: null, data: null });
    };

    const handleSave = {
        vendor: (vendor: Vendor) => {
            const isEditing = project.vendors.some(v => v.id === vendor.id);
            const log = createHistoryLog(isEditing ? `mengedit vendor "${vendor.name}".` : `menambahkan vendor baru "${vendor.name}".`);
            handleUpdateProject(prev => ({
                vendors: isEditing ? prev.vendors.map(v => v.id === vendor.id ? vendor : v) : [...prev.vendors, vendor]
            }), log);
            handleCloseModal();
        },
        expense: (expense: Expense) => {
            const isEditing = project.expenses.some(e => e.id === expense.id);
            const log = createHistoryLog(isEditing ? `mengedit pengeluaran "${expense.item}".` : `menambahkan pengeluaran baru "${expense.item}".`);
            handleUpdateProject(prev => ({
                expenses: isEditing ? prev.expenses.map(e => e.id === expense.id ? expense : e) : [...prev.expenses, expense]
            }), log);
            handleCloseModal();
        },
        task: (task: ProjectTask) => {
            const isEditing = project.tasks.some(t => t.id === task.id);
            const log = createHistoryLog(isEditing ? `mengedit tugas "${task.title}".` : `menambahkan tugas baru "${task.title}".`);
            handleUpdateProject(prev => ({
                tasks: isEditing ? prev.tasks.map(t => t.id === task.id ? task : t) : [...prev.tasks, task]
            }), log);
            handleCloseModal();
        },
        lpj: (lpj: Lpj) => {
            const log = createHistoryLog(project.lpj ? 'memperbarui LPJ.' : 'membuat LPJ.');
            const newLpj = { ...lpj, submittedDate: new Date().toISOString().split('T')[0] };
            handleUpdateProject(() => ({ lpj: newLpj }), log);
            handleCloseModal();
        },
        checkoutAsset: (asset: Asset) => {
            const newLog: UsedAssetLog = { asset, checkoutDate: new Date().toISOString() };
            const historyLog = createHistoryLog(`menggunakan aset "${asset.name}" untuk proyek.`);
            handleUpdateProject(prev => ({
                usedAssets: [...(prev.usedAssets || []), newLog]
            }), historyLog);
            updateAsset({ ...asset, status: AssetStatus.InUse });
            handleCloseModal();
        },
        handover: (newPIC: User, briefingContent: string) => {
            const handoverLog: HandoverLog = {
                id: `ho-${Date.now()}`,
                timestamp: new Date().toISOString(),
                fromPIC: project.pic,
                toPIC: newPIC,
                briefingContent,
            };
            const historyLog = createHistoryLog(`memulai serah terima PIC dari ${project.pic.name} kepada ${newPIC.name}.`);
            
            handleUpdateProject(prev => ({
                pic: newPIC,
                handoverHistory: [...(prev.handoverHistory || []), handoverLog]
            }), historyLog);

            addNotification(
                'handover_request',
                `${project.pic.name} telah menunjuk Anda sebagai PIC baru untuk proyek "${project.name}".`,
                { page: 'projects', id: project.id }
            );

            handleCloseModal();
        }
    };
    
    const handleConfirmHandover = () => {
        if (!pendingHandover) return;
        
        const log = createHistoryLog(`mengonfirmasi penerimaan tanggung jawab sebagai PIC.`);
        handleUpdateProject(prev => ({
            handoverHistory: (prev.handoverHistory || []).map(h => 
                h.id === pendingHandover.id ? { ...h, confirmationTimestamp: new Date().toISOString() } : h
            )
        }), log);

        addNotification(
            'general',
            `Serah terima PIC untuk proyek "${project.name}" kepada ${currentUser.name} telah selesai.`,
            { page: 'projects', id: project.id }
        );
    };

    return (
        <div className="space-y-6">
            <ProjectHeader project={project} onBack={onBack} onSave={() => alert('Save clicked')} canEdit={canEdit} />

            {pendingHandover && (
                <div className="bg-primary/20 border border-primary text-primary-content p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <h4 className="font-bold">Konfirmasi Serah Terima</h4>
                        <p className="text-sm">Anda ditunjuk sebagai PIC baru untuk proyek ini. Harap tinjau briefing dan konfirmasi.</p>
                    </div>
                    <button onClick={handleConfirmHandover} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500 transition">
                        Tinjau & Konfirmasi
                    </button>
                </div>
            )}
            
            <ProjectOverview project={project} onSelectUser={onSelectUser} onHandoverClick={() => handleOpenModal('handover')} canInitiateHandover={canInitiateHandover} />

            <GeminiProjectAssistant project={project} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <TaskCard tasks={project.tasks} onOpenModal={handleOpenModal} onUpdateProject={handleUpdateProject} createHistoryLog={createHistoryLog} canEdit={canEdit} />
                    <ExpenseCard expenses={project.expenses} projectName={project.name} onOpenModal={handleOpenModal} onUpdateProject={handleUpdateProject} createHistoryLog={createHistoryLog} canEdit={canEdit} />
                </div>
                <div className="space-y-6">
                    <TeamCard team={[project.pic, ...project.team]} onSelectUser={onSelectUser} />
                    <VendorCard vendors={project.vendors} onOpenModal={handleOpenModal} canEdit={canEdit} />
                    <ProjectAssetLogCard 
                        usedAssets={project.usedAssets || []}
                        onCheckoutAsset={() => handleOpenModal('checkoutAsset')}
                        onUpdateProject={handleUpdateProject}
                        createHistoryLog={createHistoryLog}
                        canEdit={canEdit}
                    />
                    <LpjCard project={project} onOpenModal={() => handleOpenModal('lpj')} onUpdateProject={handleUpdateProject} createHistoryLog={createHistoryLog} />
                    <HandoverHistoryCard handoverHistory={project.handoverHistory || []} />
                    <HistoryCard history={project.history} />
                </div>
            </div>
            
            {modalState.type === 'vendor' && <VendorModal isOpen={true} onClose={handleCloseModal} onSave={handleSave.vendor} vendor={modalState.data} />}
            {modalState.type === 'expense' && <ExpenseModal isOpen={true} onClose={handleCloseModal} onSave={handleSave.expense} expense={modalState.data} />}
            {modalState.type === 'task' && <TaskModal isOpen={true} onClose={handleCloseModal} onSave={handleSave.task} task={modalState.data} projectTeam={[project.pic, ...project.team]} allTasks={project.tasks} />}
            {modalState.type === 'lpj' && <LpjModal isOpen={true} onClose={handleCloseModal} onSave={handleSave.lpj} project={project} />}
            {modalState.type === 'checkoutAsset' && <CheckoutAssetModal isOpen={true} onClose={handleCloseModal} onCheckout={handleSave.checkoutAsset} allAssets={allAssets} />}
            {modalState.type === 'handover' && <HandoverModal isOpen={true} onClose={handleCloseModal} onSave={handleSave.handover} project={project} allUsers={allUsers} />}
        </div>
    );
};

export default ProjectDetailPage;
import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../../contexts/DataContext';

interface DepartmentData {
    name: string;
    projectCount: number;
    activeTasks: number;
    completion: number;
    members: number;
}

interface AdditionalDepartmentsPageProps {
    onSelectDepartment: (departmentName: string) => void;
}

const DepartmentCard: React.FC<{ data: DepartmentData, isActive: boolean, onClick: () => void }> = ({ data, isActive, onClick }) => (
    <div onClick={onClick} className={`p-4 rounded-lg cursor-pointer border-2 transition ${isActive ? 'bg-primary text-black border-primary shadow-lg' : 'bg-surface hover:bg-gray-700 border-gray-700'}`}>
        <h3 className="font-bold text-lg">{data.name}</h3>
        <div className={`mt-2 text-sm ${isActive ? 'text-gray-800' : 'text-gray-300'}`}>
            <p>Proyek Aktif: {data.projectCount}</p>
            <p>Penyelesaian Tugas: {data.completion.toFixed(0)}%</p>
        </div>
    </div>
);

const AdditionalDepartmentsPage: React.FC<AdditionalDepartmentsPageProps> = ({ onSelectDepartment }) => {
    const dataContext = useContext(DataContext);
    
    const departmentStats = useMemo<DepartmentData[]>(() => {
        if (!dataContext) return [];
        const { allProjects, allUsers } = dataContext;

        const departments: { [key: string]: DepartmentData } = {};

        allUsers.forEach(user => {
            if (user.department && !departments[user.department]) {
                departments[user.department] = {
                    name: user.department,
                    projectCount: 0,
                    activeTasks: 0,
                    completion: 0,
                    members: 0,
                };
            }
             if (user.department) {
                departments[user.department].members += 1;
            }
        });
        
        allProjects.forEach(project => {
            if (project.department && departments[project.department]) {
                if(project.status === 'On Progress') {
                    departments[project.department].projectCount += 1;
                }

                const totalTasks = project.tasks.length;
                if (totalTasks > 0) {
                    const completedTasks = project.tasks.filter(t => t.completed).length;
                    // This calculation might need refinement for multiple projects
                    departments[project.department].completion = (completedTasks / totalTasks) * 100;
                }
                departments[project.department].activeTasks += project.tasks.filter(t => !t.completed).length;
            }
        });
        
        // Add other hardcoded departments if they don't have projects/users yet
        const otherDepts = ['TerusBerjalan.id', 'Cecikal', 'Ganeshatu', 'MyMaiyah.id'];
        otherDepts.forEach(deptName => {
            if(!departments[deptName]) {
                 departments[deptName] = {
                    name: deptName,
                    projectCount: 0,
                    activeTasks: 0,
                    completion: 0,
                    members: 0
                };
            }
        });


        return Object.values(departments).sort((a,b) => a.name.localeCompare(b.name));
    }, [dataContext]);
    
    const [selectedDeptName, setSelectedDeptName] = useState<string | null>(departmentStats.length > 0 ? departmentStats[0].name : null);

    if (!dataContext) {
        return <div>Loading...</div>;
    }

    const selectedDeptData = departmentStats.find(d => d.name === selectedDeptName);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">Kinerja Departemen</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {departmentStats.map(dept => (
                    <DepartmentCard 
                        key={dept.name}
                        data={dept}
                        isActive={selectedDeptName === dept.name}
                        onClick={() => setSelectedDeptName(dept.name)}
                    />
                ))}
            </div>

            {selectedDeptData ? (
                <div className="bg-surface rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold mb-4 text-primary">{selectedDeptData.name}</h3>
                         <button 
                            onClick={() => onSelectDepartment(selectedDeptData.name)}
                            className="px-4 py-2 text-sm bg-secondary text-white rounded-lg hover:bg-gray-500 transition"
                        >
                            Lihat Detail
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <p className="text-gray-400">Proyek Aktif</p>
                            <p className="text-3xl font-bold">{selectedDeptData.projectCount}</p>
                        </div>
                         <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <p className="text-gray-400">Tingkat Penyelesaian Tugas</p>
                            <p className="text-3xl font-bold text-green-400">{selectedDeptData.completion.toFixed(0)}%</p>
                        </div>
                         <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                            <p className="text-gray-400">Anggota Tim</p>
                            <p className="text-3xl font-bold text-primary">{selectedDeptData.members}</p>
                        </div>
                    </div>
                </div>
            ) : (
                 <div className="text-center py-10 bg-surface rounded-lg">
                    <p className="text-gray-400">Pilih departemen untuk melihat ringkasan.</p>
                </div>
            )}
        </div>
    );
};

export default AdditionalDepartmentsPage;
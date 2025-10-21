
import React, { useState } from 'react';

const departments = [
    'TerusBerjalan.id',
    'Cecikal',
    'Ganeshatu',
    'MyMaiyah.id'
];

const departmentData: { [key: string]: { tasks: number; completion: number; achievement: number } } = {
    'TerusBerjalan.id': { tasks: 15, completion: 80, achievement: 8 },
    'Cecikal': { tasks: 12, completion: 92, achievement: 6 },
    'Ganeshatu': { tasks: 20, completion: 75, achievement: 10 },
    'MyMaiyah.id': { tasks: 8, completion: 100, achievement: 4 },
};

const DepartmentCard: React.FC<{ department: string, data: { tasks: number; completion: number; achievement: number }, isActive: boolean, onClick: () => void }> = ({ department, data, isActive, onClick }) => (
    <div onClick={onClick} className={`p-4 rounded-lg cursor-pointer border-2 transition ${isActive ? 'bg-primary text-black border-primary shadow-lg' : 'bg-surface hover:bg-gray-700 border-gray-700'}`}>
        <h3 className="font-bold text-lg">{department}</h3>
        <div className={`mt-2 text-sm ${isActive ? 'text-gray-800' : 'text-gray-300'}`}>
            <p>Tugas Aktif: {data.tasks}</p>
            <p>Penyelesaian: {data.completion}%</p>
        </div>
    </div>
);

const AdditionalDepartmentsPage: React.FC = () => {
    const [selectedDept, setSelectedDept] = useState(departments[0]);
    const data = departmentData[selectedDept];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">Kinerja Departemen</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {departments.map(dept => (
                    <DepartmentCard 
                        key={dept}
                        department={dept} 
                        data={departmentData[dept]}
                        isActive={selectedDept === dept}
                        onClick={() => setSelectedDept(dept)}
                    />
                ))}
            </div>

            <div className="bg-surface rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-primary">{selectedDept}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                        <p className="text-gray-400">Total Tugas</p>
                        <p className="text-3xl font-bold">{data.tasks}</p>
                    </div>
                     <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                        <p className="text-gray-400">Tingkat Penyelesaian</p>
                        <p className="text-3xl font-bold text-green-400">{data.completion}%</p>
                    </div>
                     <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                        <p className="text-gray-400">Pencapaian</p>
                        <p className="text-3xl font-bold text-primary">{data.achievement}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="font-semibold mb-3">Rekap Laporan</h4>
                    <ul className="space-y-2">
                        <li className="flex justify-between items-center p-3 border border-gray-700 rounded-md">
                            <span>Laporan Mingguan (W28)</span>
                            <span className="font-semibold text-green-400">Terkirim</span>
                        </li>
                         <li className="flex justify-between items-center p-3 border border-gray-700 rounded-md">
                            <span>Laporan Bulanan (Juli)</span>
                             <span className="font-semibold text-red-400">Belum Ada</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdditionalDepartmentsPage;
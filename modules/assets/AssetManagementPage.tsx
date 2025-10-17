import React, { useState, useMemo, useContext } from 'react';
import { MOCK_ASSETS } from '../../constants/mockData';
import { Asset, AssetStatus, AssetType, UserRole } from '../../types';
import { UserContext } from '../../App';

const AssetStatusBadge: React.FC<{ status: AssetStatus }> = ({ status }) => {
    const statusColorMap: { [key in AssetStatus]: string } = {
        [AssetStatus.Available]: 'bg-green-100 text-green-800',
        [AssetStatus.InUse]: 'bg-blue-100 text-blue-800',
        [AssetStatus.Maintenance]: 'bg-yellow-100 text-yellow-800',
        [AssetStatus.RentedOut]: 'bg-purple-100 text-purple-800',
        [AssetStatus.Broken]: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColorMap[status]}`}>{status}</span>;
};

const AssetManagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AssetType>(AssetType.Liquid);
    const userContext = useContext(UserContext);
    const canEdit = userContext?.user.role === UserRole.Admin || userContext?.user.role === UserRole.AssetManager;

    const filteredAssets = useMemo(() => MOCK_ASSETS.filter(asset => asset.type === activeTab), [activeTab]);

    const tabs = [
        { name: AssetType.Liquid, count: MOCK_ASSETS.filter(a => a.type === AssetType.Liquid).length },
        { name: AssetType.Permanent, count: MOCK_ASSETS.filter(a => a.type === AssetType.Permanent).length },
        { name: AssetType.Rent, count: MOCK_ASSETS.filter(a => a.type === AssetType.Rent).length },
    ];

    return (
        <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">Asset Management</h2>
                {canEdit && <button onClick={() => alert('Fitur tambah aset baru belum tersedia.')} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">Tambah Aset Baru</button>}
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`${
                                activeTab === tab.name
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                            } whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab.name}
                            <span className={`${
                                activeTab === tab.name ? 'bg-blue-100 text-primary' : 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-200'
                            } hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Aset</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Maintenance Terakhir</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jadwal Berikutnya</th>
                            {canEdit && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredAssets.map((asset: Asset) => (
                            <tr key={asset.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{asset.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><AssetStatusBadge status={asset.status} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{asset.lastMaintenance}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {asset.rentedUntil ? `Disewa s/d ${asset.rentedUntil}` : asset.nextMaintenance || '-'}
                                </td>
                                {canEdit && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => alert(`Fitur edit untuk ${asset.name} belum tersedia.`)} className="text-primary hover:text-blue-700">Edit</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetManagementPage;
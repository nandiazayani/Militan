import { User, UserRole, Asset, AssetType, AssetStatus, Project, ProjectStatus, Document, UserTask } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin Utama', role: UserRole.Admin, avatarUrl: 'https://picsum.photos/seed/admin/100/100' },
  { id: 'u2', name: 'Budi Manajer', role: UserRole.Manager, avatarUrl: 'https://picsum.photos/seed/manager1/100/100', department: 'TerusBerjalan.id' },
  { id: 'u3', name: 'Citra Staff', role: UserRole.Staff, avatarUrl: 'https://picsum.photos/seed/staff1/100/100', department: 'Cecikal' },
  { id: 'u4', name: 'Dedi Asset', role: UserRole.AssetManager, avatarUrl: 'https://picsum.photos/seed/asset/100/100' },
  { id: 'u5', name: 'Eka Staff', role: UserRole.Staff, avatarUrl: 'https://picsum.photos/seed/staff2/100/100', department: 'Ganeshatu' },
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'a1', name: 'Kamera Sony A7III', type: AssetType.Permanent, status: AssetStatus.Available, lastMaintenance: '2023-10-15' },
  { id: 'a2', name: 'Lighting Set Godox', type: AssetType.Liquid, status: AssetStatus.InUse, lastMaintenance: '2023-11-01' },
  { id: 'a3', name: 'Sound System Pro', type: AssetType.Rent, status: AssetStatus.RentedOut, lastMaintenance: '2023-09-20', rentedUntil: '2024-08-15' },
  { id: 'a4', name: 'Kabel XLR 10m', type: AssetType.Liquid, status: AssetStatus.Broken, lastMaintenance: '2023-05-10' },
  { id: 'a5', name: 'Laptop HP Victus', type: AssetType.Permanent, status: AssetStatus.InUse, lastMaintenance: '2024-01-05' },
  { id: 'a6', name: 'Proyektor Epson', type: AssetType.Permanent, status: AssetStatus.Maintenance, lastMaintenance: '2024-03-01', nextMaintenance: '2024-09-01'},
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Konser Musik Merdeka',
    status: ProjectStatus.OnProgress,
    pic: MOCK_USERS[1],
    team: [
      { user: MOCK_USERS[2], position: 'Koordinator Lapangan', progress: 75 },
      { user: MOCK_USERS[4], position: 'Logistik', progress: 90 },
    ],
    budget: { modal: 150000000, pengeluaran: 85000000, pemasukan: 180000000 },
    vendors: [{id: 'v1', name: 'Catering Enak', status: 'Paid'}, {id: 'v2', name: 'Sound System Gahar', status: 'Pending'}],
    tasks: [
        { id: 'pt1', title: 'Finalisasi Desain Panggung', assignee: MOCK_USERS[2], status: 'Done', dueDate: '2024-07-28' },
        { id: 'pt2', title: 'Booking Keamanan Acara', assignee: MOCK_USERS[2], status: 'In Progress', dueDate: '2024-08-01' },
        { id: 'pt3', title: 'Cek Ketersediaan Genset', assignee: MOCK_USERS[4], status: 'To Do', dueDate: '2024-08-05' },
    ],
    reportUrl: '#',
    startDate: '2024-08-01',
    endDate: '2024-08-17',
  },
  {
    id: 'p2',
    name: 'Pameran Seni Rupa Digital',
    status: ProjectStatus.Completed,
    pic: MOCK_USERS[1],
    team: [
      { user: MOCK_USERS[4], position: 'Desain Grafis', progress: 100 },
    ],
    budget: { modal: 50000000, pengeluaran: 45000000, pemasukan: 70000000 },
    vendors: [{id: 'v3', name: 'Percetakan Cepat', status: 'Paid'}],
    tasks: [
        { id: 'pt4', title: 'Kirim Undangan Digital', assignee: MOCK_USERS[4], status: 'Done', dueDate: '2024-05-01' },
    ],
    reportUrl: '#',
    startDate: '2024-05-10',
    endDate: '2024-05-20',
  },
  {
    id: 'p3',
    name: 'Proposal Wedding Organizer',
    status: ProjectStatus.Pitching,
    pic: MOCK_USERS[2],
    team: [],
    budget: { modal: 0, pengeluaran: 500000, pemasukan: 0 },
    vendors: [],
    tasks: [],
    startDate: '2024-09-01',
    endDate: '2024-09-30',
  },
   {
    id: 'p4',
    name: 'Festival Kuliner Nusantara',
    status: ProjectStatus.Approved,
    pic: MOCK_USERS[1],
    team: [
      { user: MOCK_USERS[2], position: 'Koordinator Acara', progress: 20 },
    ],
    budget: { modal: 200000000, pengeluaran: 15000000, pemasukan: 0 },
    vendors: [{id: 'v4', name: 'Sewa Tenda Akbar', status: 'Pending'}],
    tasks: [
        { id: 'pt5', title: 'Hubungi Tenant Makanan', assignee: MOCK_USERS[2], status: 'To Do', dueDate: '2024-09-10' },
    ],
    reportUrl: '#',
    startDate: '2024-10-01',
    endDate: '2024-10-05',
  },
];

export const MOCK_DOCUMENTS: Document[] = [
    { id: 'd1', name: 'Data Venue Jogja Expo Center', description: 'Termasuk denah layout dan kapasitas ruangan.', category: 'Venue', version: 2, lastUpdated: '2024-02-10', fileType: 'PDF', tags: ['jogja', 'exhibition'] },
    { id: 'd2', name: 'Konsep Acara Musik Indie', description: 'Draft awal untuk presentasi ke klien.', category: 'Konsep', version: 1, lastUpdated: '2023-11-20', fileType: 'DOCX', tags: ['music', 'indie'] },
    { id: 'd3', name: 'List MC & Talent 2024', category: 'Talent', version: 5, lastUpdated: '2024-03-15', fileType: 'PDF', tags: ['mc', 'host', '2024'] },
    { id: 'd4', name: 'SPK Konser Musik Merdeka', category: 'MOU & SPK', version: 1, lastUpdated: '2024-04-01', fileType: 'PDF', tags: ['p1', 'legal'] },
    { id: 'd5', name: 'Invoice Catering Enak', category: 'Invoice & Kuitansi', version: 1, lastUpdated: '2024-04-05', fileType: 'PDF', tags: ['p1', 'finance'] },
];

export const MOCK_USER_TASKS: UserTask[] = [
    { id: 't1', userId: 'u2', title: 'Follow up vendor Sound System', status: 'In Progress', dueDate: '2024-07-30' },
    { id: 't2', userId: 'u2', title: 'Buat laporan mingguan proyek', status: 'To Do', dueDate: '2024-07-28' },
    { id: 't3', userId: 'u3', title: 'Desain layout panggung', status: 'Done', dueDate: '2024-07-25' },
    { id: 't4', userId: 'u3', title: 'Submit proposal wedding', status: 'To Do', dueDate: '2024-08-05' },
    { id: 't5', userId: 'u1', title: 'Review Kinerja Bulanan', status: 'In Progress', dueDate: '2024-08-01' },
    { id: 't6', userId: 'u5', title: 'Hubungi vendor lighting', status: 'Done', dueDate: '2024-07-26' },
];
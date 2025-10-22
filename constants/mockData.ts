// FIX: Corrected import path for types
import { User, UserRole, Project, ProjectStatus, Expense, ExpenseStatus, ProjectTask, TaskPriority, Vendor, Asset, AssetStatus, AssetType, Document, UserTask, Notification, DailyReport, DailyReportStatus, LpjStatus } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', role: UserRole.Admin, department: 'Management', avatarUrl: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Budi Manager', role: UserRole.Manager, department: 'Event', avatarUrl: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Citra Staff', role: UserRole.Staff, department: 'Event', avatarUrl: 'https://i.pravatar.cc/150?u=u3' },
  { id: 'u4', name: 'Dedi Asset', role: UserRole.AssetManager, department: 'Logistik', avatarUrl: 'https://i.pravatar.cc/150?u=u4' },
  { id: 'u5', name: 'Eka Finance', role: UserRole.Finance, department: 'Keuangan', avatarUrl: 'https://i.pravatar.cc/150?u=u5' },
  { id: 'u6', name: 'Fani Staff', role: UserRole.Staff, department: 'Creative', avatarUrl: 'https://i.pravatar.cc/150?u=u6' },
];

const [admin, manager, staff1, assetManager, finance, staff2] = MOCK_USERS;

const MOCK_EXPENSES_1: Expense[] = [
    { id: 'e1', item: 'Sewa Venue', amount: 15000000, date: '2024-07-10', status: ExpenseStatus.Approved },
    { id: 'e2', item: 'Catering', amount: 8000000, date: '2024-07-12', status: ExpenseStatus.Pending },
    { id: 'e3', item: 'Spanduk & Banner', amount: 2500000, date: '2024-07-05', status: ExpenseStatus.Approved },
];

const MOCK_TASKS_1: ProjectTask[] = [
    { id: 'pt1', title: 'Finalisasi Desain Panggung', assignee: staff2, dueDate: '2024-07-20', priority: TaskPriority.High, completed: true, dependencies: [] },
    { id: 'pt2', title: 'Konfirmasi Kehadiran Talent', assignee: staff1, dueDate: '2024-07-25', priority: TaskPriority.High, completed: false, dependencies: [] },
    { id: 'pt3', title: 'Pesan Konsumsi', assignee: staff1, dueDate: '2024-08-01', priority: TaskPriority.Medium, completed: false, dependencies: ['pt2'] },
];

const MOCK_VENDORS_1: Vendor[] = [
    { id: 'v1', name: 'Gema Suara Sound System', service: 'Sound & Lighting', contact: 'Pak Roni - 08123456789' },
    { id: 'v2', name: 'Lezat Katering', service: 'Catering', contact: 'Ibu Sinta - 08234567890' },
];

export const MOCK_ASSETS: Asset[] = [
    { id: 'a1', name: 'Kamera Sony A7III', type: AssetType.Permanent, status: AssetStatus.Available, lastMaintenance: '2024-05-20', managedBy: assetManager },
    { id: 'a2', name: 'Laptop Macbook Pro M1', type: AssetType.Permanent, status: AssetStatus.InUse, lastMaintenance: '2024-06-10', managedBy: staff2 },
    { id: 'a3', name: 'Drone DJI Mavic 3', type: AssetType.Rent, status: AssetStatus.RentedOut, lastMaintenance: '2024-07-01', rentedUntil: '2024-08-01', managedBy: assetManager },
    { id: 'a4', name: 'Lighting Godox SL-60W', type: AssetType.Permanent, status: AssetStatus.Maintenance, lastMaintenance: '2024-07-15', managedBy: staff1 },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Konser Musik Kemerdekaan',
    pic: manager,
    startDate: '2024-07-01',
    endDate: '2024-08-20',
    status: ProjectStatus.OnProgress,
    budget: { modal: 50000000, pemasukan: 75000000 },
    team: [staff1, staff2, finance],
    vendors: MOCK_VENDORS_1,
    expenses: MOCK_EXPENSES_1,
    tasks: MOCK_TASKS_1,
    history: [
      { id: 'h1', timestamp: new Date().toISOString(), user: admin, action: 'membuat proyek.' },
      { id: 'h2', timestamp: new Date().toISOString(), user: manager, action: 'menambahkan vendor Gema Suara.' },
    ],
    handoverHistory: [],
    usedAssets: [
        { asset: MOCK_ASSETS[1], checkoutDate: '2024-07-15T10:00:00Z' }
    ]
  },
  {
    id: 'p2',
    name: 'Pameran Teknologi & Inovasi',
    pic: staff1,
    startDate: '2024-09-01',
    endDate: '2024-10-30',
    status: ProjectStatus.Pitching,
    budget: { modal: 120000000, pemasukan: 0 },
    team: [staff2],
    vendors: [],
    expenses: [],
    tasks: [],
    history: [],
    handoverHistory: [],
  },
  {
    id: 'p3',
    name: 'Webinar Digital Marketing',
    pic: manager,
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    status: ProjectStatus.Completed,
    budget: { modal: 15000000, pemasukan: 20000000 },
    team: [staff1],
    vendors: [],
    expenses: [{ id: 'e4', item: 'Platform Webinar', amount: 5000000, date: '2024-06-05', status: ExpenseStatus.Approved }],
    tasks: [],
    history: [],
    handoverHistory: [],
    lpj: {
      id: 'lpj1',
      status: LpjStatus.Approved,
      notes: 'Webinar berjalan sukses dengan total 250 peserta. Semua target tercapai dan feedback dari peserta sangat positif. Keuntungan bersih melebihi ekspektasi awal.',
      submittedDate: '2024-07-05',
      approvedDate: '2024-07-07',
      financialSummary: {
        totalIncome: 20000000,
        totalExpense: 5000000,
        finalBalance: 15000000
      },
      attachments: ['laporan_akhir_webinar.pdf', 'rekap_feedback_peserta.xlsx']
    }
  },
  {
    id: 'p4',
    name: 'Contoh Proyek Kalender',
    pic: manager,
    startDate: '2025-10-15',
    endDate: '2025-11-02',
    status: ProjectStatus.Pitching,
    budget: { modal: 25000000, pemasukan: 0 },
    team: [staff1],
    vendors: [],
    expenses: [],
    tasks: [],
    history: [],
    handoverHistory: [],
  },
];

export const MOCK_DOCUMENTS: Document[] = [
    { id: 'd1', name: 'MOU Konser Kemerdekaan', description: 'Memorandum of Understanding dengan sponsor utama.', category: 'MOU & SPK', fileType: 'PDF', version: 2, lastUpdated: '2024-07-02', tags: ['konser', 'sponsor', 'legal'] },
    { id: 'd2', name: 'Konsep Panggung Pameran', description: 'Desain dan layout panggung untuk pameran teknologi.', category: 'Konsep', fileType: 'JPG', version: 1, lastUpdated: '2024-06-28', tags: ['pameran', 'desain'] },
    { id: 'd3', name: 'Invoice Catering Juli', description: 'Invoice untuk layanan catering bulan Juli.', category: 'Invoice & Kuitansi', fileType: 'PDF', version: 1, lastUpdated: '2024-07-12', tags: ['invoice', 'keuangan'] },
];

export const MOCK_USER_TASKS: UserTask[] = [
    { id: 'ut1', userId: 'u3', title: 'Follow up vendor katering', dueDate: '2024-07-25', priority: TaskPriority.High, status: 'To Do' },
    { id: 'ut2', userId: 'u3', title: 'Siapkan laporan mingguan', dueDate: '2024-07-26', priority: TaskPriority.Medium, status: 'In Progress' },
    { id: 'ut3', userId: 'u6', title: 'Buat 3 opsi desain banner', dueDate: '2024-07-24', priority: TaskPriority.High, status: 'To Do' },
    { id: 'ut4', userId: 'u2', title: 'Review proposal Pameran Teknologi', dueDate: '2024-07-30', priority: TaskPriority.Medium, status: 'To Do' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', message: 'Tugas "Konfirmasi Kehadiran Talent" akan jatuh tempo dalam 3 hari.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false, type: 'general', link: { page: 'projects', id: 'p1' } },
    { id: 'n2', message: 'Admin User menambahkan Anda ke proyek "Konser Musik Kemerdekaan".', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: true, type: 'new_project', link: { page: 'projects', id: 'p1' } },
    { id: 'n3', message: 'Pengajuan pengeluaran "Catering" Anda masih pending.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: true, type: 'general', link: { page: 'projects', id: 'p1' } },
];

export const MOCK_DAILY_REPORTS: DailyReport[] = [
    {
        id: 'dr1',
        userId: 'u3', // Citra Staff
        date: new Date().toISOString().split('T')[0],
        status: DailyReportStatus.Submitted,
        tasks: [
            { id: 'dt1', description: 'Follow up vendor katering untuk Konser Kemerdekaan', hoursSpent: 2.5, attachments: ['email_follow_up.pdf'] },
            { id: 'dt2', description: 'Menyiapkan materi presentasi untuk meeting internal', hoursSpent: 4, attachments: ['presentasi_progress.pptx'] },
        ],
        history: [
            { id: 'drh1', timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), user: MOCK_USERS[2], action: 'membuat draf laporan.' },
            { id: 'drh2', timestamp: new Date().toISOString(), user: MOCK_USERS[2], action: 'mengirimkan laporan untuk direview.' }
        ]
    },
    {
        id: 'dr2',
        userId: 'u6', // Fani Staff
        date: new Date().toISOString().split('T')[0],
        status: DailyReportStatus.Draft,
        tasks: [
            { id: 'dt3', description: 'Membuat 3 opsi desain banner untuk Pameran Teknologi', hoursSpent: 5, attachments: ['opsi_banner_1.jpg', 'opsi_banner_2.jpg'] },
        ]
    }
];
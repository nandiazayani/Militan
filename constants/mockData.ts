import { User, UserRole, Project, ProjectStatus, Asset, AssetStatus, AssetType, Document, UserTask, TaskPriority, Notification, DailyReport, DailyReportStatus, LpjStatus, ExpenseStatus } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', role: UserRole.Admin, avatarUrl: 'https://i.pravatar.cc/150?u=u1', department: 'Management' },
  { id: 'u2', name: 'Manajer Proyek', role: UserRole.Manager, avatarUrl: 'https://i.pravatar.cc/150?u=u2', department: 'Event Organizer' },
  { id: 'u3', name: 'Staff Lapangan', role: UserRole.Staff, avatarUrl: 'https://i.pravatar.cc/150?u=u3', department: 'Event Organizer' },
  { id: 'u4', name: 'Staff Keuangan', role: UserRole.Finance, avatarUrl: 'https://i.pravatar.cc/150?u=u4', department: 'Finance' },
  { id: 'u5', name: 'Manajer Aset', role: UserRole.AssetManager, avatarUrl: 'https://i.pravatar.cc/150?u=u5', department: 'General Affairs' },
  { id: 'u6', name: 'Budi Santoso', role: UserRole.Staff, avatarUrl: 'https://i.pravatar.cc/150?u=u6', department: 'Creative' },
  { id: 'u7', name: 'Siti Aminah', role: UserRole.Staff, avatarUrl: 'https://i.pravatar.cc/150?u=u7', department: 'Creative' },
  { id: 'u8', name: 'Andi Wijaya', role: UserRole.Staff, avatarUrl: 'https://i.pravatar.cc/150?u=u8', department: 'Event Organizer' },
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'a1', name: 'HT ICOM IC-V80 (10 unit)', type: AssetType.Permanent, status: AssetStatus.InUse, managedBy: MOCK_USERS[4], lastMaintenance: '2024-01-01', nextMaintenance: '2025-01-01' },
  { id: 'a2', name: 'Proyektor Epson EB-X450', type: AssetType.Permanent, status: AssetStatus.Available, managedBy: MOCK_USERS[4], lastMaintenance: '2024-03-15' },
  { id: 'a3', name: 'Mobil Toyota Hiace', type: AssetType.Rent, status: AssetStatus.Available, managedBy: MOCK_USERS[4], lastMaintenance: '2024-06-20', rentedUntil: '2025-06-20' },
  { id: 'a4', name: 'Kamera Sony A7 III', type: AssetType.Permanent, status: AssetStatus.Maintenance, managedBy: MOCK_USERS[4], lastMaintenance: '2024-07-01' },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Konser Musik "Senja di Kota Tua"',
    department: 'Event Organizer',
    pic: MOCK_USERS[1],
    startDate: '2024-08-01',
    endDate: '2024-09-30',
    status: ProjectStatus.OnProgress,
    budget: { modal: 150000000, pemasukan: 250000000 },
    team: [MOCK_USERS[1], MOCK_USERS[2], MOCK_USERS[7]],
    vendors: [{ id: 'v1', name: 'SoundSystem Pro', service: 'Audio & Lighting', contact: 'Bpk. Herman - 08123456789' }],
    expenses: [
      { id: 'e1', item: 'Sewa Venue', amount: 50000000, date: '2024-08-05', status: ExpenseStatus.Approved },
      { id: 'e2', item: 'Fee SoundSystem', amount: 35000000, date: '2024-08-10', status: ExpenseStatus.Approved },
      { id: 'e3', item: 'Konsumsi Panitia', amount: 5000000, date: '2024-08-15', status: ExpenseStatus.Pending },
    ],
    tasks: [
      { id: 'pt1', title: 'Booking Venue', assignee: MOCK_USERS[2], dueDate: '2024-08-05', priority: TaskPriority.High, completed: true },
      { id: 'pt2', title: 'Finalisasi Line-up Artis', assignee: MOCK_USERS[1], dueDate: '2024-08-20', priority: TaskPriority.High, completed: false },
      { id: 'pt3', title: 'Desain Poster Acara', assignee: MOCK_USERS[6], dueDate: '2024-08-25', priority: TaskPriority.Medium, completed: false, dependencies: ['pt2'] },
    ],
    history: [
      { id: 'h1', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), user: MOCK_USERS[0], action: 'menambahkan proyek baru.' },
      { id: 'h2', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), user: MOCK_USERS[1], action: 'menambahkan tugas "Booking Venue".' },
    ],
    lpj: { id: 'lpj1', status: LpjStatus.Draft },
    usedAssets: [
        { asset: MOCK_ASSETS[0], checkoutDate: new Date().toISOString() }
    ],
    comments: [
        { id: 'c1', user: MOCK_USERS[1], timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), content: "Tim, tolong update progress untuk finalisasi artis ya. Deadline mepet." },
        { id: 'c2', user: MOCK_USERS[2], timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), content: "Siap, pak. Venue sudah aman. Sedang follow up artis terakhir." }
    ]
  },
  {
    id: 'p2',
    name: 'Pameran "Nusantara Kreatif"',
    department: 'Creative',
    pic: MOCK_USERS[5],
    startDate: '2024-09-15',
    endDate: '2024-10-15',
    status: ProjectStatus.Approved,
    budget: { modal: 80000000, pemasukan: 0 },
    team: [MOCK_USERS[5], MOCK_USERS[6]],
    vendors: [],
    expenses: [],
    tasks: [],
    history: [],
  },
  {
    id: 'p3',
    name: 'Website Launch "MyMaiyah.id"',
    department: 'MyMaiyah.id',
    pic: MOCK_USERS[1],
    startDate: '2024-07-01',
    endDate: '2024-08-30',
    status: ProjectStatus.Completed,
    budget: { modal: 50000000, pemasukan: 50000000 },
    team: [MOCK_USERS[1], MOCK_USERS[5]],
    vendors: [],
    expenses: [{id: 'e4', item: 'Hosting & Domain', amount: 2500000, date: '2024-07-02', status: ExpenseStatus.Approved}],
    tasks: [],
    history: [],
    lpj: { id: 'lpj3', status: LpjStatus.Approved, submittedDate: '2024-09-01', approvedDate: '2024-09-05' }
  }
];

export const MOCK_DOCUMENTS: Document[] = [
  { id: 'd1', name: 'MOU Konser Musik "Senja"', description: 'Dokumen kerja sama dengan pihak venue.', category: 'MOU & SPK', fileType: 'PDF', version: 2, lastUpdated: '2024-08-03', tags: ['konser', 'venue', 'legal'] },
  { id: 'd2', name: 'Konsep Visual Pameran Kreatif', description: 'Moodboard dan konsep desain untuk pameran.', category: 'Konsep', fileType: 'PDF', version: 1, lastUpdated: '2024-08-10', tags: ['pameran', 'desain', 'konsep'] },
];

export const MOCK_USER_TASKS: UserTask[] = [
    { id: 'ut1', userId: 'u3', title: 'Follow up katering untuk event', dueDate: '2024-08-28', priority: TaskPriority.High, status: 'In Progress' },
    { id: 'ut2', userId: 'u3', title: 'Siapkan laporan mingguan', dueDate: '2024-08-30', priority: TaskPriority.Medium, status: 'To Do' },
    { id: 'ut3', userId: 'u4', title: 'Rekonsiliasi bank bulan Juli', dueDate: '2024-08-15', priority: TaskPriority.High, status: 'Done' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', message: 'Staff Lapangan telah menyelesaikan tugas "Booking Venue".', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), read: false, type: 'task_completed', link: { page: 'projects', id: 'p1' } },
    { id: 'n2', message: 'Proyek baru "Pameran Nusantara Kreatif" telah ditambahkan.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true, type: 'new_project', link: { page: 'projects', id: 'p2' } },
    { id: 'n3', message: 'Jangan lupa untuk mengisi laporan harian Anda.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), read: true, type: 'general' },
];

export const MOCK_DAILY_REPORTS: DailyReport[] = [
    {
        id: 'dr1',
        userId: 'u3',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        tasks: [{ id: 'dt1', description: 'Survey venue di Kota Tua dan finalisasi negosiasi harga.', hoursSpent: 5, attachments: ['foto_venue.jpg'] }, { id: 'dt2', description: 'Meeting internal dengan tim kreatif.', hoursSpent: 2, attachments: [] }],
        status: DailyReportStatus.Reviewed,
        history: [],
        managerNotes: "Kerja bagus, progress sesuai rencana."
    },
    {
        id: 'dr2',
        userId: 'u6',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        tasks: [{ id: 'dt3', description: 'Membuat 3 opsi draf poster untuk konser.', hoursSpent: 6, attachments: ['draft1.png', 'draft2.png'] }],
        status: DailyReportStatus.Submitted,
        history: []
    }
];

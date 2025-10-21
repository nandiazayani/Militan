import { User, UserRole, Project, ProjectStatus, Asset, AssetStatus, AssetType, Document, UserTask, TaskPriority, ExpenseStatus, ProjectHistoryLog, Vendor } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ahmadinejad', role: UserRole.Admin, avatarUrl: 'https://i.pravatar.cc/150?u=u1', department: 'Executive' },
  { id: 'u2', name: 'Budi Santoso', role: UserRole.Manager, avatarUrl: 'https://i.pravatar.cc/150?u=u2', department: 'Project Management' },
  { id: 'u3', name: 'Citra Lestari', role: UserRole.Staff, avatarUrl: 'https://i.pravatar.cc/150?u=u3', department: 'Creative' },
  { id: 'u4', name: 'Dewi Anggraini', role: UserRole.AssetManager, avatarUrl: 'https://i.pravatar.cc/150?u=u4', department: 'Operations' },
  { id: 'u5', name: 'Eko Prasetyo', role: UserRole.Finance, avatarUrl: 'https://i.pravatar.cc/150?u=u5', department: 'Finance' },
  { id: 'u6', name: 'Fitriani', role: UserRole.Staff, avatarUrl: 'https://i.pravatar.cc/150?u=u6', department: 'Project Management' },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Konser Musik Kemerdekaan',
    pic: MOCK_USERS[1],
    startDate: '2023-08-01',
    endDate: '2023-08-20',
    status: ProjectStatus.Completed,
    budget: { modal: 200000000, pemasukan: 350000000 },
    team: [MOCK_USERS[2], MOCK_USERS[5]],
    vendors: [
      { id: 'v1', name: 'Sound System Pro', service: 'Audio Engineering', contact: 'John Doe - 08123456789' },
      { id: 'v2', name: 'Lighting Megah', service: 'Stage Lighting', contact: 'Jane Smith - 08987654321' }
    ],
    expenses: [
      { id: 'e1', item: 'Sewa Venue', amount: 50000000, date: '2023-08-02', status: ExpenseStatus.Approved, receiptFilenames: ['nota-venue-dp.pdf', 'surat-perjanjian-sewa.pdf'] },
      { 
        id: 'e2', 
        item: 'Talent Fee - Raisa', 
        amount: 150000000, 
        date: '2023-08-10', 
        status: ExpenseStatus.Pending, 
        originalData: { item: 'Talent Fee', amount: 120000000 },
        receiptFilenames: ['invoice-raisa.pdf'], 
      },
    ],
    tasks: [
      { id: 'pt1', title: 'Booking Venue', assignee: MOCK_USERS[2], completed: true, dueDate: '2023-08-05', priority: TaskPriority.High },
      { id: 'pt2', title: 'Finalisasi Lineup Artis', assignee: MOCK_USERS[5], completed: true, dueDate: '2023-08-12', priority: TaskPriority.Medium, dependencies: ['pt1'] },
    ],
    history: [
        { id: 'h1', timestamp: '2023-08-10T10:00:00Z', user: MOCK_USERS[2], action: 'Mengubah pengeluaran "Talent Fee" menjadi "Talent Fee - Raisa" dan jumlahnya.' },
        { id: 'h2', timestamp: '2023-08-05T14:30:00Z', user: MOCK_USERS[1], action: 'Menambahkan Citra Lestari ke tim proyek.' },
        { id: 'h3', timestamp: '2023-08-02T09:00:00Z', user: MOCK_USERS[1], action: 'Menambahkan pengeluaran baru: "Sewa Venue".' },
    ]
  },
  {
    id: 'p2',
    name: 'Pameran Teknologi & Inovasi',
    pic: MOCK_USERS[1],
    startDate: '2023-09-10',
    endDate: '2023-09-15',
    status: ProjectStatus.OnProgress,
    budget: { modal: 150000000, pemasukan: 180000000 },
    team: [MOCK_USERS[2], MOCK_USERS[5], MOCK_USERS[3]],
    vendors: [
      { id: 'v3', name: 'Booth Constructor', service: 'Exhibition Booths', contact: 'Budi - 08111222333' },
      { id: 'v4', name: 'Digital Printing', service: 'Banners & Prints', contact: 'Citra - 08556677889' }
    ],
    expenses: [
        { id: 'e3', item: 'Sewa JCC', amount: 75000000, date: '2023-09-01', status: ExpenseStatus.Approved, receiptFilenames: ['invoice-jcc.pdf'] },
    ],
    tasks: [
      { id: 'pt3', title: 'Hubungi Sponsor', assignee: MOCK_USERS[2], completed: true, dueDate: '2023-09-01', priority: TaskPriority.High },
      { id: 'pt4', title: 'Desain Layout Pameran', assignee: MOCK_USERS[5], completed: false, dueDate: '2023-09-12', priority: TaskPriority.Medium, dependencies: ['pt3'] },
    ],
  },
  {
    id: 'p3',
    name: 'Gathering Perusahaan XYZ',
    pic: MOCK_USERS[2],
    startDate: '2023-10-05',
    endDate: '2023-10-07',
    status: ProjectStatus.Approved,
    budget: { modal: 80000000, pemasukan: 100000000 },
    team: [MOCK_USERS[5]],
    vendors: [
      { id: 'v5', name: 'Catering Enak', service: 'Food & Beverages', contact: 'Siti - 0876543210' },
      { id: 'v6', name: 'EO Partner', service: 'Event Organizing', contact: 'Rudi - 08998877665' }
    ],
    expenses: [],
    tasks: [],
  },
    {
    id: 'p4',
    name: 'Festival Kuliner Nusantara',
    pic: MOCK_USERS[1],
    startDate: '2023-11-01',
    endDate: '2023-11-05',
    status: ProjectStatus.Pitching,
    budget: { modal: 50000000, pemasukan: 0 },
    team: [MOCK_USERS[2]],
    vendors: [],
    // FIX: Added missing expenses property to satisfy the Project interface.
    expenses: [],
    tasks: [],
  },
  {
    id: 'p5',
    name: 'Peluncuran Produk ABC',
    pic: MOCK_USERS[5],
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    status: ProjectStatus.OnProgress,
    budget: { modal: 120000000, pemasukan: 120000000 },
    team: [MOCK_USERS[2], MOCK_USERS[3]],
    vendors: [
      { id: 'v7', name: 'Venue Hotel Bintang 5', service: 'Venue Provider', contact: 'Manager - 021500500' },
      { id: 'v8', name: 'PR Agency', service: 'Public Relations', contact: 'Dewi - 08123123123' }
    ],
    expenses: [
      { id: 'e4', item: 'Down Payment Venue', amount: 30000000, date: '2023-12-01', status: ExpenseStatus.Approved, receiptFilenames: ['dp-venue-hotel.pdf'] },
    ],
    tasks: [
      { id: 'pt5', title: 'Kirim Undangan Media', assignee: MOCK_USERS[2], completed: false, dueDate: '2024-01-10', priority: TaskPriority.High },
    ],
  },
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'a1', name: 'Proyektor Epson EB-X500', type: AssetType.Permanent, status: AssetStatus.Available, lastMaintenance: '2023-06-01', nextMaintenance: '2023-12-01' },
  { id: 'a2', name: 'Mixer Audio Yamaha MG16XU', type: AssetType.Permanent, status: AssetStatus.InUse, lastMaintenance: '2023-05-15' },
  { id: 'a3', name: 'Lighting PAR LED (Set 8)', type: AssetType.Rent, status: AssetStatus.RentedOut, lastMaintenance: '2023-07-01', rentedUntil: '2023-09-30' },
  { id: 'a4', name: 'Laptop Dell XPS 15', type: AssetType.Permanent, status: AssetStatus.Maintenance, lastMaintenance: '2023-08-25' },
  { id: 'a5', name: 'Kamera Sony A7 III', type: AssetType.Permanent, status: AssetStatus.Broken, lastMaintenance: '2023-04-10' },
  { id: 'a6', name: 'Wireless Microphone Shure (4 Ch)', type: AssetType.Liquid, status: AssetStatus.Available, lastMaintenance: '2023-08-01' },
];

export const MOCK_DOCUMENTS: Document[] = [
  // FIX: Added missing description property to all documents
  { id: 'd1', name: 'Quotation Venue Hotel Mulia', description: 'Penawaran harga untuk sewa ballroom Hotel Mulia.', category: 'Venue', fileType: 'PDF', version: 2, lastUpdated: '2023-08-15', tags: ['jakarta', 'venue', '2023'] },
  { id: 'd2', name: 'Konsep Acara Konser Kemerdekaan', description: 'Detail konsep acara, rundown, dan tema visual untuk Konser Kemerdekaan.', category: 'Konsep', fileType: 'DOCX', version: 3, lastUpdated: '2023-07-20', tags: ['konsep', 'konser'] },
  { id: 'd3', name: 'Rider Artis Tulus', description: 'Technical and hospitality riders untuk penampilan Tulus.', category: 'Talent', fileType: 'PDF', version: 1, lastUpdated: '2023-08-01', tags: ['talent', 'rider'] },
  { id: 'd4', name: 'Kontrak Vendor Sound System', description: 'Perjanjian kerja sama dengan vendor Sound System Pro.', category: 'Vendor', fileType: 'PDF', version: 1, lastUpdated: '2023-08-05', tags: ['kontrak', 'vendor', 'audio'] },
  { id: 'd5', name: 'MOU Klien Perusahaan XYZ', description: 'Memorandum of Understanding untuk project gathering Perusahaan XYZ.', category: 'MOU & SPK', fileType: 'DOCX', version: 1, lastUpdated: '2023-09-01', tags: ['mou', 'legal'] },
  { id: 'd6', name: 'Invoice DP Venue Pameran', description: 'Bukti pembayaran down payment untuk sewa JCC.', category: 'Invoice & Kuitansi', fileType: 'JPG', version: 1, lastUpdated: '2023-09-02', tags: ['invoice', 'finance'] },
];

export const MOCK_USER_TASKS: UserTask[] = [
  { id: 't1', userId: 'u3', title: 'Desain materi promosi Konser', status: 'Done', dueDate: '2023-08-10', priority: TaskPriority.High },
  { id: 't2', userId: 'u3', title: 'Revisi layout booth pameran', status: 'In Progress', dueDate: '2023-09-12', priority: TaskPriority.Medium },
  { id: 't3', userId: 'u6', title: 'Follow up sponsor pameran', status: 'In Progress', dueDate: '2023-09-10', priority: TaskPriority.High },
  { id: 't4', userId: 'u6', title: 'Buat laporan mingguan proyek', status: 'To Do', dueDate: '2023-09-08', priority: TaskPriority.Low },
  { id: 't5', userId: 'u2', title: 'Review Anggaran Kuartal 4', status: 'To Do', dueDate: '2023-09-15', priority: TaskPriority.High },
];
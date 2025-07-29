export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'patient';
  telephone?: string;
  address?: string;
  createdAt: string;
}

export interface Examination {
  id: string;
  tanggal: string;
  skor: number;
  usia: number;
  jenis_kelamin: string;
  alamat: string;
  lama_sakit: string;
  createdAt: string;
  updatedAt: string;
  pasien?: {
    id: number;
    name: string;
    email: string | null;
  };
}

export interface StaffPatientAssignment {
  id: string;
  staffId: string;
  patientId: string;
  staffName?: string;
  patientName?: string;
  assignedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalExaminations: number;
  activeStaff: number;
  todayExaminations: number;
  adminCount: number;
  staffCount: number;
  patientCount: number;
}
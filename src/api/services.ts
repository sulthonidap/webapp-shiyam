import { User, Examination, StaffPatientAssignment, DashboardStats } from '../types';
import { mockData } from './client';

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Base URL
const API_BASE_URL = 'https://api-shiyam.giescare.com/api';

export const userService = {
  async getUsers(role?: string): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let users = await response.json();
      
      // Transform API data to match User type
      users = users.map((user: any) => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email || '',
        role: (user.role === 'pasien' ? 'patient' : user.role) as 'admin' | 'staff' | 'patient', // Handle API role mapping
        telephone: user.telephone || undefined,
        address: user.address || undefined,
        createdAt: user.createdAt,
      })) as User[];
      
      // Filter by role if specified
      if (role) {
        users = users.filter((user: User) => user.role === role);
      }
      
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data if API fails
      await delay(500);
      let users = mockData.users;
      if (role) {
        users = users.filter(user => user.role === role);
      }
      return users;
    }
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      // Transform data for API (handle role mapping)
      const apiData = {
        ...userData,
        role: userData.role === 'patient' ? 'pasien' : userData.role,
      };
      
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const createdUser = await response.json();
      
      // Transform back to User type
      return {
        id: createdUser.id.toString(),
        name: createdUser.name,
        email: createdUser.email || '',
        role: (createdUser.role === 'pasien' ? 'patient' : createdUser.role) as 'admin' | 'staff' | 'patient',
        telephone: createdUser.telephone || undefined,
        address: createdUser.address || undefined,
        createdAt: createdUser.createdAt,
      } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      // Fallback to mock data if API fails
      await delay(500);
      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      mockData.users.push(newUser);
      return newUser;
    }
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      // Transform data for API (handle role mapping)
      const apiData = {
        ...userData,
        role: userData.role === 'patient' ? 'pasien' : userData.role,
      };
      
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedUser = await response.json();
      
      // Transform back to User type
      return {
        id: updatedUser.id.toString(),
        name: updatedUser.name,
        email: updatedUser.email || '',
        role: (updatedUser.role === 'pasien' ? 'patient' : updatedUser.role) as 'admin' | 'staff' | 'patient',
        telephone: updatedUser.telephone || undefined,
        address: updatedUser.address || undefined,
        createdAt: updatedUser.createdAt,
      } as User;
    } catch (error) {
      console.error('Error updating user:', error);
      // Fallback to mock data if API fails
      await delay(500);
      const index = mockData.users.findIndex(user => user.id === id);
      if (index === -1) throw new Error('User not found');
      
      mockData.users[index] = { ...mockData.users[index], ...userData };
      return mockData.users[index];
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      // Fallback to mock data if API fails
      await delay(500);
      const index = mockData.users.findIndex(user => user.id === id);
      if (index === -1) throw new Error('User not found');
      
      mockData.users.splice(index, 1);
    }
  },
};

export const examinationService = {
  async getExaminations(): Promise<Examination[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/pemeriksaan`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const examinations = await response.json();
      
      // Transform API data to match Examination type
      return examinations.map((exam: any) => ({
        id: exam.id.toString(),
        tanggal: exam.tanggal,
        skor: exam.skor,
        usia: exam.usia,
        jenis_kelamin: exam.jenis_kelamin,
        alamat: exam.alamat,
        lama_sakit: exam.lama_sakit,
        createdAt: exam.createdAt,
        updatedAt: exam.updatedAt,
        pasien: exam.pasien ? {
          id: exam.pasien.id,
          name: exam.pasien.name,
          email: exam.pasien.email,
        } : undefined,
      })) as Examination[];
    } catch (error) {
      console.error('Error fetching examinations:', error);
      // Fallback to mock data if API fails
      await delay(500);
      return mockData.examinations;
    }
  },

  async createExamination(examinationData: Omit<Examination, 'id' | 'createdAt' | 'updatedAt'>): Promise<Examination> {
    try {
      const response = await fetch(`${API_BASE_URL}/pemeriksaan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examinationData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const createdExam = await response.json();
      
      // Transform back to Examination type
      return {
        id: createdExam.id.toString(),
        tanggal: createdExam.tanggal,
        skor: createdExam.skor,
        usia: createdExam.usia,
        jenis_kelamin: createdExam.jenis_kelamin,
        alamat: createdExam.alamat,
        lama_sakit: createdExam.lama_sakit,
        createdAt: createdExam.createdAt,
        updatedAt: createdExam.updatedAt,
        pasien: createdExam.pasien ? {
          id: createdExam.pasien.id,
          name: createdExam.pasien.name,
          email: createdExam.pasien.email,
        } : undefined,
      } as Examination;
    } catch (error) {
      console.error('Error creating examination:', error);
      // Fallback to mock data if API fails
      await delay(500);
      const newExamination: Examination = {
        ...examinationData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockData.examinations.push(newExamination);
      return newExamination;
    }
  },

  async updateExamination(id: string, examinationData: Partial<Examination>): Promise<Examination> {
    try {
      const response = await fetch(`${API_BASE_URL}/pemeriksaan/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examinationData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedExam = await response.json();
      
      // Transform back to Examination type
      return {
        id: updatedExam.id.toString(),
        tanggal: updatedExam.tanggal,
        skor: updatedExam.skor,
        usia: updatedExam.usia,
        jenis_kelamin: updatedExam.jenis_kelamin,
        alamat: updatedExam.alamat,
        lama_sakit: updatedExam.lama_sakit,
        createdAt: updatedExam.createdAt,
        updatedAt: updatedExam.updatedAt,
        pasien: updatedExam.pasien ? {
          id: updatedExam.pasien.id,
          name: updatedExam.pasien.name,
          email: updatedExam.pasien.email,
        } : undefined,
      } as Examination;
    } catch (error) {
      console.error('Error updating examination:', error);
      // Fallback to mock data if API fails
      await delay(500);
      const index = mockData.examinations.findIndex(exam => exam.id === id);
      if (index === -1) throw new Error('Examination not found');
      
      mockData.examinations[index] = { ...mockData.examinations[index], ...examinationData };
      return mockData.examinations[index];
    }
  },

  async deleteExamination(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/pemeriksaan/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting examination:', error);
      // Fallback to mock data if API fails
      await delay(500);
      const index = mockData.examinations.findIndex(exam => exam.id === id);
      if (index === -1) throw new Error('Examination not found');
      
      mockData.examinations.splice(index, 1);
    }
  },
};

export const staffService = {
  async getStaffPatients(staffId: string): Promise<StaffPatientAssignment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/${staffId}/pasien`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const patients = await response.json();
      
      // Transform API data to match StaffPatientAssignment type
      return patients.map((patient: any) => ({
        id: patient.id.toString(),
        staffId: staffId,
        patientId: patient.id?.toString() || '',
        staffName: undefined,
        patientName: patient.name || undefined,
        assignedAt: patient.createdAt || new Date().toISOString(),
      })) as StaffPatientAssignment[];
    } catch (error) {
      console.error('Error fetching staff patients:', error);
      // Fallback to mock data if API fails
      await delay(500);
      return mockData.staffAssignments.filter(assignment => assignment.staffId === staffId);
    }
  },

  async getStaffExaminations(staffId: string): Promise<Examination[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/${staffId}/pemeriksaan`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const examinations = await response.json();
      
      // Transform API data to match Examination type
      return examinations.map((exam: any) => ({
        id: exam.id.toString(),
        tanggal: exam.tanggal,
        skor: exam.skor,
        usia: exam.usia,
        jenis_kelamin: exam.jenis_kelamin,
        alamat: exam.alamat,
        lama_sakit: exam.lama_sakit,
        createdAt: exam.createdAt,
        updatedAt: exam.updatedAt,
        pasien: exam.pasien ? {
          id: exam.pasien.id,
          name: exam.pasien.name,
          email: exam.pasien.email,
        } : undefined,
      })) as Examination[];
    } catch (error) {
      console.error('Error fetching staff examinations:', error);
      // Fallback to mock data if API fails
      await delay(500);
      return [];
    }
  },

  async assignPatientToStaff(staffId: string, patientId: string): Promise<StaffPatientAssignment> {
    try {
      const response = await fetch(`${API_BASE_URL}/staff-assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ staffId, patientId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const assignment = await response.json();
      
      // Transform back to StaffPatientAssignment type
      return {
        id: assignment.id.toString(),
        staffId: assignment.staffId?.toString() || '',
        patientId: assignment.patientId?.toString() || '',
        staffName: assignment.staffName || undefined,
        patientName: assignment.patientName || undefined,
        assignedAt: assignment.assignedAt,
      } as StaffPatientAssignment;
    } catch (error) {
      console.error('Error assigning patient to staff:', error);
      // Fallback to mock data if API fails
      await delay(500);
      const staff = mockData.users.find(u => u.id === staffId && u.role === 'staff');
      const patient = mockData.users.find(u => u.id === patientId && u.role === 'patient');
      
      if (!staff || !patient) throw new Error('Staff or patient not found');
      
      const newAssignment: StaffPatientAssignment = {
        id: Math.random().toString(36).substr(2, 9),
        staffId,
        patientId,
        staffName: staff.name,
        patientName: patient.name,
        assignedAt: new Date().toISOString(),
      };
      
      mockData.staffAssignments.push(newAssignment);
      return newAssignment;
    }
  },

  async removePatientFromStaff(staffId: string, patientId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/staff-assignments/${staffId}/${patientId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error removing patient from staff:', error);
      // Fallback to mock data if API fails
      await delay(500);
      const index = mockData.staffAssignments.findIndex(
        assignment => assignment.staffId === staffId && assignment.patientId === patientId
      );
      
      if (index === -1) throw new Error('Assignment not found');
      mockData.staffAssignments.splice(index, 1);
    }
  },
};

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const stats = await response.json();
      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to mock data if API fails
      await delay(500);
      const users = mockData.users;
      const examinations = mockData.examinations;
      
      const today = new Date().toISOString().split('T')[0];
      const todayExaminations = examinations.filter(exam => exam.tanggal === today);
      
      return {
        totalUsers: users.length,
        totalExaminations: examinations.length,
        activeStaff: users.filter(u => u.role === 'staff').length,
        todayExaminations: todayExaminations.length,
        adminCount: users.filter(u => u.role === 'admin').length,
        staffCount: users.filter(u => u.role === 'staff').length,
        patientCount: users.filter(u => u.role === 'patient').length,
      };
    }
  },

  // Fungsi untuk mendapatkan statistik dari data yang sudah ada
  async getStatsFromExistingData(): Promise<DashboardStats> {
    try {
      // Ambil semua data yang diperlukan
      const [users, examinations] = await Promise.all([
        userService.getUsers(),
        examinationService.getExaminations()
      ]);

      // Hitung statistik
      const today = new Date().toISOString().split('T')[0];
      const todayExaminations = examinations.filter(exam => exam.tanggal === today);
      
      return {
        totalUsers: users.length,
        totalExaminations: examinations.length,
        activeStaff: users.filter(u => u.role === 'staff').length,
        todayExaminations: todayExaminations.length,
        adminCount: users.filter(u => u.role === 'admin').length,
        staffCount: users.filter(u => u.role === 'staff').length,
        patientCount: users.filter(u => u.role === 'patient').length,
      };
    } catch (error) {
      console.error('Error calculating stats from existing data:', error);
      throw error;
    }
  },

  async getExaminationTrends(): Promise<Array<{ name: string; examinations: number }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/examination-trends`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching examination trends:', error);
      // Fallback to mock data if API fails
      await delay(500);
      return [
        { name: 'Jan', examinations: 65 },
        { name: 'Feb', examinations: 59 },
        { name: 'Mar', examinations: 80 },
        { name: 'Apr', examinations: 81 },
        { name: 'May', examinations: 56 },
        { name: 'Jun', examinations: 55 },
        { name: 'Jul', examinations: 40 },
      ];
    }
  },

  async getMonthlyStats(): Promise<Array<{ name: string; examinations: number; users: number }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/monthly-stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      // Fallback to mock data if API fails
      await delay(500);
      return [
        { name: 'Week 1', examinations: 20, users: 5 },
        { name: 'Week 2', examinations: 35, users: 8 },
        { name: 'Week 3', examinations: 28, users: 12 },
        { name: 'Week 4', examinations: 42, users: 15 },
      ];
    }
  },
};
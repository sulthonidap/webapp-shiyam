import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for demo purposes
export const mockData = {
  users: [
    { id: '1', name: 'Dr. John Smith', email: 'john@Shiyam.com', role: 'admin', telephone: '+1-555-0101', address: '123 Medical Ave', createdAt: '2024-01-15T08:00:00Z' },
    { id: '2', name: 'Nurse Sarah Wilson', email: 'sarah@Shiyam.com', role: 'staff', telephone: '+1-555-0102', address: '456 Care St', createdAt: '2024-01-16T09:00:00Z' },
    { id: '3', name: 'Alice Johnson', email: 'alice@patient.com', role: 'patient', telephone: '+1-555-0103', address: '789 Patient Rd', createdAt: '2024-01-17T10:00:00Z' },
    { id: '4', name: 'Bob Brown', email: 'bob@patient.com', role: 'patient', telephone: '+1-555-0104', address: '321 Health Blvd', createdAt: '2024-01-18T11:00:00Z' },
    { id: '5', name: 'Dr. Emily Davis', email: 'emily@Shiyam.com', role: 'staff', telephone: '+1-555-0105', address: '654 Medical Center', createdAt: '2024-01-19T12:00:00Z' },
  ],
  examinations: [
    { 
      id: '1', 
      tanggal: '2024-01-20', 
      skor: 85, 
      usia: 35, 
      jenis_kelamin: 'Perempuan', 
      alamat: '789 Patient Rd', 
      lama_sakit: 'Regular checkup - all vitals normal', 
      createdAt: '2024-01-20T14:00:00Z',
      updatedAt: '2024-01-20T14:00:00Z',
      pasien: { id: 3, name: 'Alice Johnson', email: 'alice@patient.com' }
    },
    { 
      id: '2', 
      tanggal: '2024-01-21', 
      skor: 78, 
      usia: 42, 
      jenis_kelamin: 'Laki-laki', 
      alamat: '321 Health Blvd', 
      lama_sakit: 'Follow-up examination for blood pressure', 
      createdAt: '2024-01-21T15:00:00Z',
      updatedAt: '2024-01-21T15:00:00Z',
      pasien: { id: 4, name: 'Bob Brown', email: 'bob@patient.com' }
    },
    { 
      id: '3', 
      tanggal: '2024-01-22', 
      skor: 92, 
      usia: 35, 
      jenis_kelamin: 'Perempuan', 
      alamat: '789 Patient Rd', 
      lama_sakit: 'Scheduled for routine examination', 
      createdAt: '2024-01-22T16:00:00Z',
      updatedAt: '2024-01-22T16:00:00Z',
      pasien: { id: 3, name: 'Alice Johnson', email: 'alice@patient.com' }
    },
  ],
  staffAssignments: [
    { id: '1', staffId: '2', patientId: '3', staffName: 'Nurse Sarah Wilson', patientName: 'Alice Johnson', assignedAt: '2024-01-15T08:00:00Z' },
    { id: '2', staffId: '5', patientId: '4', staffName: 'Dr. Emily Davis', patientName: 'Bob Brown', assignedAt: '2024-01-16T09:00:00Z' },
  ]
};
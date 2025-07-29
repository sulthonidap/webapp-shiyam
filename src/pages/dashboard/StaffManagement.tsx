import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, UserGroupIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

import { userService, staffService } from '../../api/services';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const StaffManagement: React.FC = () => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const queryClient = useQueryClient();

  const { data: staff = [], isLoading: staffLoading } = useQuery({
    queryKey: ['users', 'staff'],
    queryFn: () => userService.getUsers('staff'),
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['users', 'patient'],
    queryFn: () => userService.getUsers('patient'),
  });

  const { data: staffPatients = [], isLoading: staffPatientsLoading } = useQuery({
    queryKey: ['staff-patients', selectedStaffId],
    queryFn: () => selectedStaffId ? staffService.getStaffPatients(selectedStaffId) : Promise.resolve([]),
    enabled: !!selectedStaffId,
  });

  const { data: staffExaminations = [], isLoading: staffExaminationsLoading } = useQuery({
    queryKey: ['staff-examinations', selectedStaffId],
    queryFn: () => selectedStaffId ? staffService.getStaffExaminations(selectedStaffId) : Promise.resolve([]),
    enabled: !!selectedStaffId,
  });

  const assignPatientMutation = useMutation({
    mutationFn: ({ staffId, patientId }: { staffId: string; patientId: string }) =>
      staffService.assignPatientToStaff(staffId, patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-patients'] });
      toast.success('Patient assigned successfully');
      setIsAssignModalOpen(false);
      setSelectedPatientId('');
    },
    onError: () => {
      toast.error('Failed to assign patient');
    },
  });

  const removePatientMutation = useMutation({
    mutationFn: ({ staffId, patientId }: { staffId: string; patientId: string }) =>
      staffService.removePatientFromStaff(staffId, patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-patients'] });
      toast.success('Patient removed successfully');
    },
    onError: () => {
      toast.error('Failed to remove patient');
    },
  });

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset pagination when search term changes
  }, [searchTerm]);

  const handleAssignPatient = () => {
    if (!selectedStaffId || !selectedPatientId) {
      toast.error('Please select both staff and patient');
      return;
    }

    assignPatientMutation.mutate({
      staffId: selectedStaffId,
      patientId: selectedPatientId,
    });
  };

  const handleRemovePatient = (patientId: string) => {
    if (!selectedStaffId) return;

    if (window.confirm('Are you sure you want to remove this patient assignment?')) {
      removePatientMutation.mutate({
        staffId: selectedStaffId,
        patientId,
      });
    }
  };

  const availablePatients = patients.filter(patient =>
    !staffPatients.some(assignment => assignment.patientId === patient.id)
  );

  const exportStaffToExcel = () => {
    try {
      if (!selectedStaffId) {
        toast.error('Please select a staff member first');
        return;
      }

      const selectedStaff = staff.find(s => s.id === selectedStaffId);
      if (!selectedStaff) {
        toast.error('Staff member not found');
        return;
      }

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Prepare staff data (single row)
      const staffData = [{
        'ID Staff': selectedStaff.id,
        'Nama Staff': selectedStaff.name,
        'Email Staff': selectedStaff.email,
        'Telepon Staff': selectedStaff.telephone || 'N/A',
        'Alamat Staff': selectedStaff.address || 'N/A',
        'Role': 'Staff',
        'Created At': new Date(selectedStaff.createdAt).toLocaleString(),
      }];

      // Create staff worksheet
      const staffWs = XLSX.utils.json_to_sheet(staffData);
      
      // Set column widths for staff
      const staffColWidths = [
        { wch: 15 }, // ID Staff
        { wch: 25 }, // Nama Staff
        { wch: 30 }, // Email Staff
        { wch: 15 }, // Telepon Staff
        { wch: 40 }, // Alamat Staff
        { wch: 10 }, // Role
        { wch: 20 }, // Created At
      ];
      staffWs['!cols'] = staffColWidths;

      // Add staff worksheet
      XLSX.utils.book_append_sheet(wb, staffWs, 'Staff Info');

      // Prepare patient examination data
      const patientData = staffExaminations.map(examination => ({
        'ID Pemeriksaan': examination.id,
        'Nama Pasien': examination.pasien?.name || 'N/A',
        'Email Pasien': examination.pasien?.email || 'N/A',
        'Tanggal': new Date(examination.tanggal).toLocaleDateString(),
        'Skor': examination.skor,
        'Usia': examination.usia,
        'Jenis Kelamin': examination.jenis_kelamin === 'male' ? 'Laki-laki' : 
                        examination.jenis_kelamin === 'female' ? 'Perempuan' : 
                        examination.jenis_kelamin,
        'Alamat': examination.alamat,
        'Lama Sakit': examination.lama_sakit,
        'Created At': new Date(examination.createdAt).toLocaleString(),
      }));

      // Create patient worksheet
      const patientWs = XLSX.utils.json_to_sheet(patientData);
      
      // Set column widths for patients
      const patientColWidths = [
        { wch: 15 }, // ID Pemeriksaan
        { wch: 25 }, // Nama Pasien
        { wch: 30 }, // Email Pasien
        { wch: 12 }, // Tanggal
        { wch: 8 },  // Skor
        { wch: 8 },  // Usia
        { wch: 15 }, // Jenis Kelamin
        { wch: 40 }, // Alamat
        { wch: 20 }, // Lama Sakit
        { wch: 20 }, // Created At
      ];
      patientWs['!cols'] = patientColWidths;

      // Add patient worksheet
      XLSX.utils.book_append_sheet(wb, patientWs, 'Patient Examinations');

      // Generate filename with current date and staff name
      const today = new Date().toISOString().split('T')[0];
      const staffName = selectedStaff.name.replace(/\s+/g, '_');
      const filename = `staff_${staffName}_patients_${today}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
      
      toast.success(`Data staff dan pasien berhasil diekspor!`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export data');
    }
  };

  if (staffLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-2">Manage staff members and their patient assignments</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={exportStaffToExcel} 
            className="flex items-center bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Staff List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Staff Members</h2>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telepon
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedStaff.map((member) => (
                  <tr 
                    key={member.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedStaffId === member.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedStaffId(member.id)}
                  >
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email}</div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.telephone || 'N/A'}</div>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{member.address || 'N/A'}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Staff</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <div className="text-sm text-gray-700 text-center sm:text-left">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStaff.length)} of {filteredStaff.length} results
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-3 py-2 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pasien Terikat */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedStaffId 
                ? `Pasien Terikat - ${staff.find(s => s.id === selectedStaffId)?.name}`
                : 'Pilih staff member'}
            </h2>
          </div>

          <div className="p-6">
            {!selectedStaffId ? (
              <div className="text-center py-12">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Pilih staff member untuk melihat pasien terikat</p>
              </div>
            ) : staffPatientsLoading ? (
              <div className="text-center py-8">
                <LoadingSpinner />
                <p className="text-sm text-gray-500 mt-2">Loading pasien...</p>
              </div>
            ) : staffPatients.length === 0 ? (
              <div className="text-center py-12">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada pasien terikat ke staff ini</p>
              </div>
            ) : (
              <div className="space-y-3">
                {staffPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{patient.patientName}</h3>
                      <p className="text-sm text-gray-500">
                        ID: {patient.patientId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hasil Pemeriksaan - Data Table */}
      {selectedStaffId && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Hasil Pemeriksaan - {staff.find(s => s.id === selectedStaffId)?.name}
            </h2>
          </div>

          <div className="overflow-x-auto">
            {staffExaminationsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : staffExaminations.length === 0 ? (
              <div className="text-center py-12">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada hasil pemeriksaan untuk staff ini</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pasien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Kelamin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alamat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lama Sakit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staffExaminations.map((examination) => (
                    <tr key={examination.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {examination.pasien?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(examination.tanggal).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {examination.skor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {examination.usia}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {examination.jenis_kelamin}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {examination.alamat}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {examination.lama_sakit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Staff Statistics - Commented for now */}
      {/* 
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Staff Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{staff.length}</div>
            <div className="text-sm text-gray-500">Total Staff Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{patients.length}</div>
            <div className="text-sm text-gray-500">Total Patients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {staff.length > 0 ? Math.round(patients.length / staff.length) : 0}
            </div>
            <div className="text-sm text-gray-500">Avg Patients per Staff</div>
          </div>
        </div>
      </div>
      */}

      {/* Assign Patient Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Patient to Staff"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a patient...</option>
              {availablePatients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.email}
                </option>
              ))}
            </select>
          </div>

          {availablePatients.length === 0 && (
            <p className="text-sm text-gray-500">
              All patients are already assigned to this staff member.
            </p>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignPatient}
              loading={assignPatientMutation.isPending}
              disabled={!selectedPatientId || availablePatients.length === 0}
            >
              Assign Patient
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
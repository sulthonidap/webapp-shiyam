import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { userService, staffService } from '../../api/services';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const StaffManagement: React.FC = () => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

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

  if (staffLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-600 mt-2">Manage staff members and their patient assignments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          <div className="p-6">
            <div className="space-y-3">
              {filteredStaff.map((member) => (
                <div
                  key={member.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedStaffId === member.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedStaffId(member.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      {member.telephone && (
                        <p className="text-sm text-gray-500">{member.telephone}</p>
                      )}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <UserGroupIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
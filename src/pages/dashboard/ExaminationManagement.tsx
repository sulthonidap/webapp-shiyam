import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { examinationService, userService } from '../../api/services';
import { Examination } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const examinationSchema = z.object({
  tanggal: z.string().min(1, 'Tanggal is required'),
  skor: z.number().min(0, 'Skor must be positive'),
  usia: z.number().min(0, 'Usia must be positive'),
  jenis_kelamin: z.string().min(1, 'Jenis kelamin is required'),
  alamat: z.string().min(1, 'Alamat is required'),
  lama_sakit: z.string().min(1, 'Lama sakit is required'),
});

type ExaminationFormData = z.infer<typeof examinationSchema>;

export const ExaminationManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExamination, setEditingExamination] = useState<Examination | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  const { data: examinations = [], isLoading } = useQuery({
    queryKey: ['examinations'],
    queryFn: examinationService.getExaminations,
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['users', 'patient'],
    queryFn: () => userService.getUsers('patient'),
  });

  const { data: staff = [] } = useQuery({
    queryKey: ['users', 'staff'],
    queryFn: () => userService.getUsers('staff'),
  });

  const createExaminationMutation = useMutation({
    mutationFn: examinationService.createExamination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examinations'] });
      toast.success('Examination created successfully');
      setIsModalOpen(false);
      reset();
    },
    onError: () => {
      toast.error('Failed to create examination');
    },
  });

  const updateExaminationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Examination> }) => 
      examinationService.updateExamination(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examinations'] });
      toast.success('Examination updated successfully');
      setIsModalOpen(false);
      setEditingExamination(null);
      reset();
    },
    onError: () => {
      toast.error('Failed to update examination');
    },
  });

  const deleteExaminationMutation = useMutation({
    mutationFn: examinationService.deleteExamination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examinations'] });
      toast.success('Examination deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete examination');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ExaminationFormData>({
    resolver: zodResolver(examinationSchema),
  });

  const filteredExaminations = examinations.filter(examination => {
    const matchesSearch = 
      examination.pasien?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      examination.lama_sakit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      examination.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredExaminations.length / itemsPerPage);
  const paginatedExaminations = filteredExaminations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = (examination?: Examination) => {
    setEditingExamination(examination || null);
    if (examination) {
      reset({
        tanggal: examination.tanggal,
        skor: examination.skor,
        usia: examination.usia,
        jenis_kelamin: examination.jenis_kelamin,
        alamat: examination.alamat,
        lama_sakit: examination.lama_sakit,
      });
    } else {
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExamination(null);
    reset();
  };

  const onSubmit = (data: ExaminationFormData) => {
    if (editingExamination) {
      updateExaminationMutation.mutate({ id: editingExamination.id, data });
    } else {
      createExaminationMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this examination?')) {
      deleteExaminationMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Examination Management</h1>
          <p className="text-gray-600 mt-2">Manage patient examinations and medical records</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="mt-4 sm:mt-0">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Examination
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search examinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Examinations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedExaminations.map((examination) => (
                <tr key={examination.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{examination.pasien?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(examination.tanggal).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{examination.skor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{examination.usia}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{examination.jenis_kelamin}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{examination.alamat}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{examination.lama_sakit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleOpenModal(examination)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(examination.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredExaminations.length)} of {filteredExaminations.length} results
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

      {/* Examination Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExamination ? 'Edit Examination' : 'Add Examination'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal *
              </label>
              <input
                type="date"
                {...register('tanggal')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.tanggal && <p className="mt-1 text-sm text-red-600">{errors.tanggal.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skor *
              </label>
              <input
                type="number"
                {...register('skor', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan skor"
              />
              {errors.skor && <p className="mt-1 text-sm text-red-600">{errors.skor.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usia *
              </label>
              <input
                type="number"
                {...register('usia', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan usia"
              />
              {errors.usia && <p className="mt-1 text-sm text-red-600">{errors.usia.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin *
              </label>
              <select
                {...register('jenis_kelamin')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
              {errors.jenis_kelamin && <p className="mt-1 text-sm text-red-600">{errors.jenis_kelamin.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat *
            </label>
            <textarea
              {...register('alamat')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan alamat..."
            />
            {errors.alamat && <p className="mt-1 text-sm text-red-600">{errors.alamat.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lama Sakit *
            </label>
            <textarea
              {...register('lama_sakit')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan lama sakit..."
            />
            {errors.lama_sakit && <p className="mt-1 text-sm text-red-600">{errors.lama_sakit.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={createExaminationMutation.isPending || updateExaminationMutation.isPending}
            >
              {editingExamination ? 'Update' : 'Create'} Examination
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
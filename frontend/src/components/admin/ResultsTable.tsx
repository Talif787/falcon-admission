// frontend/src/components/admin/ResultsTable.tsx
'use client';

import { useState } from 'react';
import { Applicant } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Trash2, RefreshCw, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface ResultsTableProps {
  applicants: Applicant[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  filters: { outcome: string; program: string };
  onPageChange: (page: number) => void;
  onFilterChange: (filters: { outcome: string; program: string }) => void;
  onViewTranscript: (applicant: Applicant) => void;
  onDelete: (sessionId: string) => void;
  onRefresh: () => void;
}

export default function ResultsTable({
  applicants = [],
  loading,
  currentPage,
  totalPages,
  filters,
  onPageChange,
  onFilterChange,
  onViewTranscript,
  onDelete,
  onRefresh
}: ResultsTableProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Ensure applicants is always an array
  const safeApplicants = applicants || [];

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Meets Criteria':
        return 'bg-green-100 text-green-800';
      case 'Criteria Not Met':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Applicant Results</h2>
          <p className="text-sm text-gray-600 mt-1">
            {safeApplicants.length} {safeApplicants.length === 1 ? 'result' : 'results'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
              showFilters ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outcome
              </label>
              <select
                value={filters.outcome}
                onChange={(e) => onFilterChange({ ...filters, outcome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Outcomes</option>
                <option value="Meets Criteria">Meets Criteria</option>
                <option value="Criteria Not Met">Criteria Not Met</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program
              </label>
              <select
                value={filters.program}
                onChange={(e) => onFilterChange({ ...filters, program: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Programs</option>
                <option value="Business">Business</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-y border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Program
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Outcome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rule Summary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                  Loading applicants...
                </td>
              </tr>
            ) : safeApplicants.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No applicants found
                </td>
              </tr>
            ) : (
              safeApplicants.map((applicant) => (
                <tr key={applicant._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {applicant.studentName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{applicant.program}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getOutcomeColor(applicant.outcome)}`}>
                      {applicant.outcome}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-xs truncate">
                      {applicant.ruleSummary || 'No summary available'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {applicant.createdAt ? formatDistanceToNow(new Date(applicant.createdAt), { addSuffix: true }) : 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewTranscript(applicant)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(applicant.sessionId)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 border rounded-lg flex items-center gap-1 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 border rounded-lg flex items-center gap-1 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
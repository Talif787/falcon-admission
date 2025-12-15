// frontend/src/components/admin/AdminDashboard.tsx
// COMPLETE VERSION - Full design with working data fetch

'use client';

import { useState, useEffect } from 'react';
import UploadSection from './UploadSection';
import ResultsTable from './ResultsTable';
import TranscriptModal from './TranscriptModal';
import { Applicant, KnowledgeBase } from '@/lib/types';
import toast from 'react-hot-toast';
import { FileText, Users, TrendingUp, Clock } from 'lucide-react';

interface Statistics {
  total: number;
  eligible: number;
  notEligible: number;
  inProgress: number;
  businessApplicants: number;
  csApplicants: number;
}

export default function AdminDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<{ outcome: string; program: string }>({ outcome: '', program: '' });

  // Initial load
  useEffect(() => {
    console.log('Component mounted');
    fetchAllData();
  }, []);

  // Reload when page or filters change
  useEffect(() => {
    if (currentPage > 1 || filters.outcome || filters.program) {
      fetchApplicants();
    }
  }, [currentPage, filters]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchApplicants(),
        fetchKnowledgeBase(),
        fetchStatistics()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async () => {
    try {
      console.log('📡 Fetching applicants...');
      
      const url = new URL('http://localhost:5000/api/admin/applicants');
      url.searchParams.set('page', currentPage.toString());
      url.searchParams.set('limit', '20');
      if (filters.outcome) url.searchParams.set('outcome', filters.outcome);
      if (filters.program) url.searchParams.set('program', filters.program);
      
      console.log('🔗 URL:', url.toString());
      
      const response = await fetch(url.toString());
      const json = await response.json();
      
      console.log('📦 Response:', json);
      console.log('👥 Applicants count:', json.data.applicants.length);
      
      setApplicants(json.data.applicants);
      setTotalPages(json.data.pagination?.totalPages || 1);
      
      console.log('Applicants state updated');
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setApplicants([]);
    }
  };

  const fetchKnowledgeBase = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/knowledge-base');
      if (response.ok) {
        const json = await response.json();
        setKnowledgeBase(json.data);
      }
    } catch (error) {
      console.log('No knowledge base');
      setKnowledgeBase(null);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/statistics');
      const json = await response.json();
      setStatistics(json.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setStatistics(null);
    }
  };

  const handlePDFUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      
      const response = await fetch('http://localhost:5000/api/admin/upload-pdf', {
        method: 'POST',
        body: formData
      });
      
      const json = await response.json();
      
      if (json.success) {
        toast.success('PDF uploaded successfully!');
        await fetchKnowledgeBase();
      } else {
        throw new Error(json.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload PDF');
      throw error;
    }
  };

  const handleStartInterview = async () => {
    if (!knowledgeBase) {
      toast.error('Please upload requirements PDF first');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/start-interview', {
        method: 'POST'
      });
      
      const json = await response.json();
      
      if (json.success && json.data?.sessionId && json.data?.interviewUrl) {
        const interviewUrl = `${window.location.origin}${json.data.interviewUrl}`;
        
        try {
          await navigator.clipboard.writeText(interviewUrl);
          toast.success('Interview link copied to clipboard!');
        } catch (e) {
          toast.success(`Interview created!`);
        }
        
        window.open(interviewUrl, '_blank');
        
        // Refresh applicants after short delay
        setTimeout(() => fetchApplicants(), 500);
      }
    } catch (error: any) {
      toast.error('Failed to create interview session');
    }
  };

  const handleViewTranscript = async (applicant: Applicant) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/applicants/${applicant.sessionId}/transcript`);
      const json = await response.json();
      
      if (json.success) {
        setSelectedApplicant(json.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      toast.error('Failed to load transcript');
    }
  };

  const handleDeleteApplicant = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this applicant?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/applicants/${sessionId}`, {
        method: 'DELETE'
      });
      
      const json = await response.json();
      
      if (json.success) {
        toast.success('Applicant deleted successfully');
        await fetchApplicants();
        await fetchStatistics();
      } else {
        throw new Error(json.message);
      }
    } catch (error) {
      toast.error('Failed to delete applicant');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Falcon University Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage admission requirements and review applicant interviews
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6 text-blue-600" />}
            title="Total Applicants"
            value={statistics.total}
            color="bg-blue-50"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            title="Meets Criteria"
            value={statistics.eligible}
            subtitle={`${Math.round((statistics.eligible / Math.max(statistics.total, 1)) * 100)}%`}
            color="bg-green-50"
          />
          <StatCard
            icon={<FileText className="w-6 h-6 text-purple-600" />}
            title="Business Program"
            value={statistics.businessApplicants}
            color="bg-purple-50"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-orange-600" />}
            title="In Progress"
            value={statistics.inProgress}
            color="bg-orange-50"
          />
        </div>
      )}

      {/* Upload and Start Interview Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UploadSection
            onUpload={handlePDFUpload}
            currentKnowledgeBase={knowledgeBase}
          />
          
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Interview Management
            </h2>
            <button
              onClick={handleStartInterview}
              disabled={!knowledgeBase}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                knowledgeBase
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Start New Interview
            </button>
            {!knowledgeBase && (
              <p className="text-sm text-gray-500 mt-2">
                Upload requirements PDF to enable interviews
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ResultsTable
          applicants={applicants}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          filters={filters}
          onPageChange={setCurrentPage}
          onFilterChange={setFilters}
          onViewTranscript={handleViewTranscript}
          onDelete={handleDeleteApplicant}
          onRefresh={fetchApplicants}
        />
      </div>

      {/* Transcript Modal */}
      {selectedApplicant && (
        <TranscriptModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedApplicant(null);
          }}
          applicant={selectedApplicant}
        />
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle?: string;
  color: string;
}

function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
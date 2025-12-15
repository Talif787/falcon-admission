// EMERGENCY SIMPLE VERSION - Replace AdminDashboard.tsx temporarily

'use client';

import { useState, useEffect } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Applicant {
  _id: string;
  studentName: string;
  program: string;
  outcome: string;
  ruleSummary: string;
  sessionId: string;
  createdAt: string;
  gpa?: number;
}

export default function AdminDashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    try {
      console.log('Loading applicants...');
      setLoading(true);
      
      const response = await fetch('http://localhost:5000/api/admin/applicants');
      const json = await response.json();
      
      console.log('Response:', json);
      console.log('Applicants:', json.data.applicants);
      
      setApplicants(json.data.applicants);
      
      console.log('State set to:', json.data.applicants);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm('Delete this applicant?')) return;
    
    try {
      await fetch(`http://localhost:5000/api/admin/applicants/${sessionId}`, {
        method: 'DELETE'
      });
      toast.success('Deleted');
      loadApplicants();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  console.log('RENDER - Applicants:', applicants, 'Count:', applicants.length);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster />
      
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard (Simple Test)</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Applicants</h2>
          <button
            onClick={loadApplicants}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        <div className="mb-4 p-3 bg-yellow-100 rounded">
          <p className="text-sm"><strong>Debug Info:</strong></p>
          <p className="text-sm">Loading: {loading ? 'YES' : 'NO'}</p>
          <p className="text-sm">Count: {applicants.length}</p>
          <p className="text-sm">Type: {typeof applicants}</p>
          <p className="text-sm">Is Array: {Array.isArray(applicants) ? 'YES' : 'NO'}</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No applicants found</div>
        ) : (
          <div className="space-y-2">
            {applicants.map((app) => (
              <div key={app._id} className="border rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-bold text-lg">{app.studentName}</div>
                    <div className="text-sm text-gray-600">
                      {app.program} • {app.outcome}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {app.ruleSummary}
                    </div>
                    {app.gpa && (
                      <div className="text-sm text-gray-600 mt-1">
                        GPA: {app.gpa}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Session: ${app.sessionId}`)}
                      className="p-2 hover:bg-gray-200 rounded"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(app.sessionId)}
                      className="p-2 hover:bg-gray-200 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> This is a simplified test version. 
          If you can see applicants here, the issue is in the original AdminDashboard component logic.
        </p>
      </div>
    </div>
  );
}
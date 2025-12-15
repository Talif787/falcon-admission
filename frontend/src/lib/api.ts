// frontend/src/lib/api.ts
import axios, { AxiosInstance } from 'axios';
import { Applicant, KnowledgeBase, ApiResponse, PaginatedResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface UploadPDFResponseData {
  id: string;
  originalName: string;
  pageCount: number;
  wordCount: number;
  sectionsCount: number;
  embeddingsCount: number;
  version: number;
  requirements: unknown; // stays flexible because PDF requirements are dynamic
}

export interface StatisticsData {
  total: number;
  eligible: number;
  notEligible: number;
  inProgress: number;
  businessApplicants: number;
  csApplicants: number;
}

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Avoid logging full URLs with sensitive params in prod if needed
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async uploadPDF(file: File) {
    const formData = new FormData();
    formData.append('pdf', file);

    return this.client.post<ApiResponse<UploadPDFResponseData>>(
      '/api/admin/upload-pdf',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async getApplicants(
    page: number = 1,
    limit: number = 20,
    filters?: { outcome?: string; program?: string }
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.outcome && { outcome: filters.outcome }),
      ...(filters?.program && { program: filters.program }),
    });

    return this.client.get<ApiResponse<PaginatedResponse<Applicant>>>(
      `/api/admin/applicants?${params.toString()}`
    );
  }

  async getApplicant(sessionId: string) {
    return this.client.get<ApiResponse<Applicant>>(`/api/admin/applicants/${sessionId}`);
  }

  async getTranscript(sessionId: string) {
    return this.client.get<ApiResponse<Applicant>>(
      `/api/admin/applicants/${sessionId}/transcript`
    );
  }

  async deleteApplicant(sessionId: string) {
    return this.client.delete<ApiResponse<void>>(`/api/admin/applicants/${sessionId}`);
  }

  async getStatistics() {
    return this.client.get<ApiResponse<StatisticsData>>('/api/admin/statistics');
  }

  async getKnowledgeBase() {
    return this.client.get<ApiResponse<KnowledgeBase>>('/api/admin/knowledge-base');
  }

  async createInterviewSession() {
    return this.client.post<ApiResponse<{ sessionId: string; interviewUrl: string }>>(
      '/api/admin/start-interview'
    );
  }
}

export const API = new APIClient();

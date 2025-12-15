// frontend/src/lib/types.ts
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date | string;
}

export interface Applicant {
  _id: string;
  studentName: string;
  program: 'Business' | 'Computer Science';
  outcome: 'Meets Criteria' | 'Criteria Not Met' | 'In Progress';
  ruleSummary: string;
  transcript: Message[];
  sessionId: string;
  gpa?: number;
  testScores?: {
    sat?: number;
    act?: number;
    gre?: number;
    gmat?: number;
  };
  workExperience?: number;
  extracurriculars?: string[];
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    interviewDuration?: number;
    completedAt?: Date | string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface KnowledgeBase {
  _id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  uploadedAt: Date | string;
  parsedText: string;
  metadata: {
    pageCount?: number;
    wordCount?: number;
    sections?: Array<{
      title: string;
      content: string;
    }>;
    requirements?: Array<{
      program: string;
      criteria: Record<string, unknown>;
    }>;
  };
  isActive: boolean;
  version: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  applicants: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

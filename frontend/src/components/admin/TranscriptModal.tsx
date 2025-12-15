// frontend/src/components/admin/TranscriptModal.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Applicant, Message } from '@/lib/types';
import { X, User, Bot, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: Applicant;
}

export default function TranscriptModal({ isOpen, onClose, applicant }: TranscriptModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Scroll to bottom of transcript
      setTimeout(() => {
        if (transcriptRef.current) {
          transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getOutcomeIcon = () => {
    switch (applicant.outcome) {
      case 'Meets Criteria':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'Criteria Not Met':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getOutcomeColor = () => {
    switch (applicant.outcome) {
      case 'Meets Criteria':
        return 'text-green-800 bg-green-100';
      case 'Criteria Not Met':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-yellow-800 bg-yellow-100';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {getOutcomeIcon()}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Interview Transcript
              </h2>
              <p className="text-sm text-gray-600">
                {applicant.studentName} • {applicant.program}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Summary Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Outcome</h3>
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getOutcomeColor()}`}>
                {applicant.outcome}
              </span>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Session ID</h3>
              <p className="text-sm text-gray-900 font-mono">{applicant.sessionId}</p>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Rule Summary</h3>
              <p className="text-sm text-gray-900">{applicant.ruleSummary || 'No summary available'}</p>
            </div>
            
            {applicant.metadata?.interviewDuration && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Interview Duration</h3>
                <p className="text-sm text-gray-900">
                  {Math.floor(applicant.metadata.interviewDuration / 60000)} minutes
                </p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Completed At</h3>
              <p className="text-sm text-gray-900">
                {applicant.metadata?.completedAt
                  ? format(new Date(applicant.metadata.completedAt), 'PPpp')
                  : 'In Progress'}
              </p>
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div
          ref={transcriptRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {applicant.transcript && applicant.transcript.length > 0 ? (
            applicant.transcript.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No messages in transcript
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>
              Interview started: {applicant.createdAt ? format(new Date(applicant.createdAt), 'PPpp') : 'Unknown'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-100' : 'bg-purple-100'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-blue-600" />
        ) : (
          <Bot className="w-5 h-5 text-purple-600" />
        )}
      </div>
      
      <div className={`flex-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp ? format(new Date(message.timestamp), 'HH:mm:ss') : ''}
        </p>
      </div>
    </div>
  );
}
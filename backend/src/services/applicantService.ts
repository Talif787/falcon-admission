// backend/src/services/applicantService.ts
import Applicant, { IApplicant } from '../models/Applicant';
import { logger } from '../utils/logger';
import { randomUUID } from 'crypto';

export class ApplicantService {
  /**
   * Create new applicant session
   */
  static async createApplicant(sessionId?: string): Promise<IApplicant> {
    try {
      const applicant = new Applicant({
        sessionId: sessionId || randomUUID(),
        studentName: 'Anonymous',
        program: 'Business', // Default, will be updated
        outcome: 'In Progress'
      });

      await applicant.save();
      logger.info(`New applicant created: ${applicant.sessionId}`);
      
      return applicant;
    } catch (error) {
      logger.error('Error creating applicant:', error);
      throw error;
    }
  }

  /**
   * Get all applicants with pagination
   */
  static async getAllApplicants(
    page: number = 1,
    limit: number = 20,
    filters?: { outcome?: string; program?: string }
  ): Promise<{ applicants: IApplicant[]; total: number; pages: number }> {
    try {
      const query: any = {};
      
      if (filters?.outcome) {
        query.outcome = filters.outcome;
      }
      
      if (filters?.program) {
        query.program = filters.program;
      }

      const total = await Applicant.countDocuments(query);
      const applicants = await Applicant.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        applicants,
        total,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error getting applicants:', error);
      throw error;
    }
  }

  /**
   * Get applicant by session ID
   */
  static async getApplicantBySessionId(sessionId: string): Promise<IApplicant | null> {
    try {
      return await Applicant.findOne({ sessionId });
    } catch (error) {
      logger.error('Error getting applicant:', error);
      throw error;
    }
  }

  /**
   * Update applicant information
   */
  static async updateApplicant(
    sessionId: string,
    updates: Partial<IApplicant>
  ): Promise<IApplicant | null> {
    try {
      const applicant = await Applicant.findOneAndUpdate(
        { sessionId },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (applicant) {
        logger.info(`Applicant updated: ${sessionId}`);
      }

      return applicant;
    } catch (error) {
      logger.error('Error updating applicant:', error);
      throw error;
    }
  }

  /**
   * Add message to transcript
   */
  static async addMessageToTranscript(
    sessionId: string,
    role: 'user' | 'assistant' | 'system',
    content: string
  ): Promise<IApplicant | null> {
    try {
      const applicant = await Applicant.findOne({ sessionId });
      
      if (!applicant) {
        throw new Error(`Applicant not found: ${sessionId}`);
      }

      await applicant.addMessage(role, content);
      return applicant;
    } catch (error) {
      logger.error('Error adding message:', error);
      throw error;
    }
  }

  /**
   * Complete applicant evaluation
   */
  static async completeEvaluation(
    sessionId: string,
    outcome: 'Meets Criteria' | 'Criteria Not Met',
    ruleSummary: string,
    startTime?: Date
  ): Promise<IApplicant | null> {
    try {
      const updates: any = {
        outcome,
        ruleSummary,
        'metadata.completedAt': new Date()
      };

      if (startTime) {
        updates['metadata.interviewDuration'] = Date.now() - startTime.getTime();
      }

      return await this.updateApplicant(sessionId, updates);
    } catch (error) {
      logger.error('Error completing evaluation:', error);
      throw error;
    }
  }

  /**
   * Delete applicant
   */
  static async deleteApplicant(sessionId: string): Promise<boolean> {
    try {
      const result = await Applicant.deleteOne({ sessionId });
      return result.deletedCount > 0;
    } catch (error) {
      logger.error('Error deleting applicant:', error);
      throw error;
    }
  }

  /**
   * Get statistics
   */
  static async getStatistics() {
    try {
      return await (Applicant as any).getStatistics();
    } catch (error) {
      logger.error('Error getting statistics:', error);
      throw error;
    }
  }
}
import { ApplicantService } from '../../src/services/applicantService';
import Applicant from '../../src/models/Applicant';

jest.mock('../../src/models/Applicant');

describe('ApplicantService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createApplicant', () => {
    it('should create new applicant with default values', async () => {
      const mockSave = jest.fn().mockResolvedValue({
        sessionId: 'test-session-id',
        studentName: 'Anonymous',
        outcome: 'In Progress'
      });

      (Applicant as any).mockImplementation(() => ({
        save: mockSave
      }));

      const result = await ApplicantService.createApplicant();
      
      expect(mockSave).toHaveBeenCalled();
      expect(result).toHaveProperty('sessionId');
    });
  });

  describe('updateApplicant', () => {
    it('should update applicant successfully', async () => {
      const mockUpdate = jest.fn().mockResolvedValue({
        sessionId: 'test-id',
        studentName: 'John Doe'
      });

      (Applicant.findOneAndUpdate as any) = mockUpdate;

      const result = await ApplicantService.updateApplicant('test-id', {
        studentName: 'John Doe'
      });

      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('completeEvaluation', () => {
    it('should complete evaluation with outcome', async () => {
      const startTime = new Date(Date.now() - 60000); // 1 minute ago
      
      const mockUpdate = jest.fn().mockResolvedValue({
        outcome: 'Meets Criteria',
        ruleSummary: 'Test summary'
      });

      jest.spyOn(ApplicantService, 'updateApplicant').mockImplementation(mockUpdate);

      await ApplicantService.completeEvaluation(
        'test-id',
        'Meets Criteria',
        'Test summary',
        startTime
      );

      expect(mockUpdate).toHaveBeenCalled();
    });
  });
});
// src/controllers/adminController.ts
import { Request, Response, NextFunction } from 'express';
import KnowledgeBase from '../models/KnowledgeBase';
import { PDFService } from '../services/pdfService';
import { EmbeddingService } from '../services/embeddingService';
import { ApplicantService } from '../services/applicantService';
import { RequirementsParser } from '../services/requirementsParser';
import { logger } from '../utils/logger';

export class AdminController {
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService(process.env.GEMINI_API_KEY!);
  }

  /**
   * Upload and process PDF requirements
   */
  uploadPDF = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const filePath = req.file.path;
      logger.info(`Processing PDF: ${req.file.originalname}`);

      const parsedResult = await PDFService.parsePDF(filePath);

      const requirements = RequirementsParser.parseRequirements(parsedResult.text);

      logger.info('Parsed requirements from PDF', {
        programs: requirements.map((r) => r.program),
        fields: requirements.map((r) => ({ program: r.program, fieldCount: r.fields.length })),
      });

      const chunks = this.embeddingService.splitTextIntoChunks(parsedResult.text);

      logger.info(`Creating embeddings for ${chunks.length} chunks...`);
      const embeddings = await this.embeddingService.createEmbeddings(chunks);

      await (KnowledgeBase as any).deactivatePrevious();

      const latestKB = await KnowledgeBase.findOne().sort({ version: -1 });
      const nextVersion = latestKB ? latestKB.version + 1 : 1;

      const knowledgeBase = new KnowledgeBase({
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        parsedText: parsedResult.text,
        embeddings,
        metadata: {
          pageCount: parsedResult.pageCount,
          wordCount: parsedResult.wordCount,
          sections: parsedResult.sections,
          requirements,
        },
        isActive: true,
        version: nextVersion,
      });

      await knowledgeBase.save();

      logger.info(`Knowledge base created successfully: ${knowledgeBase._id}`);

      return res.status(200).json({
        success: true,
        message: 'PDF uploaded and processed successfully',
        data: {
          id: knowledgeBase._id,
          originalName: knowledgeBase.originalName,
          pageCount: parsedResult.pageCount,
          wordCount: parsedResult.wordCount,
          sectionsCount: parsedResult.sections.length,
          embeddingsCount: embeddings.length,
          version: nextVersion,
          requirements,
        },
      });
    } catch (error) {
      logger.error('Error in uploadPDF:', error);
      return next(error);
    }
  };

  /**
   * Get all applicants
   */
  getApplicants = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const outcome = req.query.outcome as string;
      const program = req.query.program as string;

      const filters: any = {};
      if (outcome) filters.outcome = outcome;
      if (program) filters.program = program;

      const result = await ApplicantService.getAllApplicants(page, limit, filters);

      return res.status(200).json({
        success: true,
        data: {
          applicants: result.applicants,
          pagination: {
            currentPage: page,
            totalPages: result.pages,
            totalItems: result.total,
            itemsPerPage: limit,
          },
        },
      });
    } catch (error) {
      logger.error('Error in getApplicants:', error);
      return next(error);
    }
  };

  /**
   * Get single applicant by ID
   */
  getApplicant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;

      const applicant = await ApplicantService.getApplicantBySessionId(sessionId);

      if (!applicant) {
        return res.status(404).json({
          success: false,
          message: 'Applicant not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: applicant,
      });
    } catch (error) {
      logger.error('Error in getApplicant:', error);
      return next(error);
    }
  };

  /**
   * Get applicant transcript
   */
  getTranscript = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;

      const applicant = await ApplicantService.getApplicantBySessionId(sessionId);

      if (!applicant) {
        return res.status(404).json({
          success: false,
          message: 'Applicant not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          sessionId: applicant.sessionId,
          studentName: applicant.studentName,
          program: applicant.program,
          outcome: applicant.outcome,
          ruleSummary: applicant.ruleSummary,
          transcript: applicant.transcript,
          createdAt: applicant.createdAt,
          metadata: applicant.metadata,
        },
      });
    } catch (error) {
      logger.error('Error in getTranscript:', error);
      return next(error);
    }
  };

  /**
   * Delete applicant
   */
  deleteApplicant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;

      const deleted = await ApplicantService.deleteApplicant(sessionId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Applicant not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Applicant deleted successfully',
      });
    } catch (error) {
      logger.error('Error in deleteApplicant:', error);
      return next(error);
    }
  };

  /**
   * Get statistics
   */
  getStatistics = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await ApplicantService.getStatistics();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Error in getStatistics:', error);
      return next(error);
    }
  };

  /**
   * Get active knowledge base
   */
  getKnowledgeBase = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const kb = await (KnowledgeBase as any).getActiveKnowledgeBase();

      if (!kb) {
        return res.status(404).json({
          success: false,
          message: 'No active knowledge base found',
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: kb._id,
          originalName: kb.originalName,
          uploadedAt: kb.uploadedAt,
          version: kb.version,
          metadata: kb.metadata,
        },
      });
    } catch (error) {
      logger.error('Error in getKnowledgeBase:', error);
      return next(error);
    }
  };

  /**
   * Create interview session
   */
  createInterviewSession = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const kb = await (KnowledgeBase as any).getActiveKnowledgeBase();

      if (!kb) {
        return res.status(400).json({
          success: false,
          message: 'Please upload requirements PDF before starting interviews',
        });
      }

      const applicant = await ApplicantService.createApplicant();

      logger.info(`Interview session created: ${applicant.sessionId}`);

      return res.status(201).json({
        success: true,
        message: 'Interview session created',
        data: {
          sessionId: applicant.sessionId,
          interviewUrl: `/interview/${applicant.sessionId}`,
        },
      });
    } catch (error) {
      logger.error('Error in createInterviewSession:', error);
      return next(error);
    }
  };
}

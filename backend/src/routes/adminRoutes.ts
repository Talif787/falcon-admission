// backend/src/routes/adminRoutes.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import { AdminController } from '../controllers/adminController';

const router = express.Router();
const adminController = new AdminController();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// Routes
router.post('/upload-pdf', upload.single('pdf'), adminController.uploadPDF);
router.get('/applicants', adminController.getApplicants);
router.get('/applicants/:sessionId', adminController.getApplicant);
router.get('/applicants/:sessionId/transcript', adminController.getTranscript);
router.delete('/applicants/:sessionId', adminController.deleteApplicant);
router.get('/statistics', adminController.getStatistics);
router.get('/knowledge-base', adminController.getKnowledgeBase);
router.post('/start-interview', adminController.createInterviewSession);

export default router;

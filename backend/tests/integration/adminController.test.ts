import request from 'supertest';
import express from 'express';
import adminRoutes from '../../src/routes/adminRoutes';
import { connectDatabase } from '../../src/config/database';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

describe('Admin Controller Integration Tests', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/admin/upload-pdf', () => {
    it('should upload and process PDF successfully', async () => {
      const response = await request(app)
        .post('/api/admin/upload-pdf')
        .attach('pdf', 'tests/fixtures/sample.pdf')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('pageCount');
    });

    it('should reject non-PDF files', async () => {
      const response = await request(app)
        .post('/api/admin/upload-pdf')
        .attach('pdf', 'tests/fixtures/invalid.txt')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject files larger than 10MB', async () => {
      // Test with large file
      const response = await request(app)
        .post('/api/admin/upload-pdf')
        .attach('pdf', 'tests/fixtures/large.pdf')
        .expect(400);
    });
  });

  describe('GET /api/admin/applicants', () => {
    it('should return paginated applicants', async () => {
      const response = await request(app)
        .get('/api/admin/applicants?page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('applicants');
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should filter by outcome', async () => {
      const response = await request(app)
        .get('/api/admin/applicants?outcome=Meets Criteria')
        .expect(200);

      response.body.data.applicants.forEach((applicant: any) => {
        expect(applicant.outcome).toBe('Meets Criteria');
      });
    });

    it('should filter by program', async () => {
      const response = await request(app)
        .get('/api/admin/applicants?program=Business')
        .expect(200);

      response.body.data.applicants.forEach((applicant: any) => {
        expect(applicant.program).toBe('Business');
      });
    });
  });

  describe('GET /api/admin/applicants/:sessionId', () => {
    it('should return specific applicant', async () => {
      // First create an applicant
      const createResponse = await request(app)
        .post('/api/admin/start-interview')
        .expect(201);

      const sessionId = createResponse.body.data.sessionId;

      const response = await request(app)
        .get(`/api/admin/applicants/${sessionId}`)
        .expect(200);

      expect(response.body.data.sessionId).toBe(sessionId);
    });

    it('should return 404 for non-existent applicant', async () => {
      const response = await request(app)
        .get('/api/admin/applicants/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/admin/applicants/:sessionId', () => {
    it('should delete applicant successfully', async () => {
      // Create applicant
      const createResponse = await request(app)
        .post('/api/admin/start-interview')
        .expect(201);

      const sessionId = createResponse.body.data.sessionId;

      // Delete applicant
      const deleteResponse = await request(app)
        .delete(`/api/admin/applicants/${sessionId}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);

      // Verify deletion
      await request(app)
        .get(`/api/admin/applicants/${sessionId}`)
        .expect(404);
    });
  });

  describe('GET /api/admin/statistics', () => {
    it('should return applicant statistics', async () => {
      const response = await request(app)
        .get('/api/admin/statistics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('eligible');
      expect(response.body.data).toHaveProperty('notEligible');
    });
  });
});
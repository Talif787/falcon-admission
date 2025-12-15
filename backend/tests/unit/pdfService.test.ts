// backend/tests/unit/pdfService.test.ts
import { PDFService } from '../../src/services/pdfService';
import path from 'path';

describe('PDFService', () => {
  describe('parsePDF', () => {
    it('should successfully parse a valid PDF file', async () => {
      const testPDF = path.join(__dirname, '../fixtures/sample.pdf');
      const result = await PDFService.parsePDF(testPDF);
      
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('pageCount');
      expect(result).toHaveProperty('wordCount');
      expect(result.pageCount).toBeGreaterThan(0);
    });

    it('should throw error for invalid file', async () => {
      const invalidFile = path.join(__dirname, '../fixtures/invalid.txt');
      await expect(PDFService.parsePDF(invalidFile)).rejects.toThrow();
    });

    it('should extract sections correctly', async () => {
      const testPDF = path.join(__dirname, '../fixtures/requirements.pdf');
      const result = await PDFService.parsePDF(testPDF);
      
      expect(result.sections).toBeInstanceOf(Array);
      expect(result.sections.length).toBeGreaterThan(0);
    });
  });

  describe('extractRequirements', () => {
    it('should extract Business program requirements', () => {
      const sampleText = `
        Business Program Requirements:
        GPA: 3.5
        GMAT: 650
        Work Experience: 2 years
      `;
      
      const requirements = PDFService.extractRequirements(sampleText);
      expect(requirements).toHaveLength(1);
      expect(requirements[0].program).toBe('Business');
      expect(requirements[0].criteria.minimumGPA).toBe(3.5);
    });

    it('should extract Computer Science program requirements', () => {
      const sampleText = `
        Computer Science Requirements:
        GPA: 3.0
        GRE: 310
      `;
      
      const requirements = PDFService.extractRequirements(sampleText);
      expect(requirements).toHaveLength(1);
      expect(requirements[0].program).toBe('Computer Science');
    });
  });
});
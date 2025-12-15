// backend/src/services/pdfService.ts
import pdf from 'pdf-parse';
import fs from 'fs/promises';
import { logger } from '../utils/logger';

export interface ParsedPDFResult {
  text: string;
  pageCount: number;
  wordCount: number;
  sections: Array<{ title: string; content: string }>;
}

export class PDFService {
  /**
   * Parse PDF file and extract text content
   */
  static async parsePDF(filePath: string): Promise<ParsedPDFResult> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);

      const text = data.text;
      const pageCount = data.numpages;
      const wordCount = text.split(/\s+/).length;

      // Extract sections based on common patterns
      const sections = this.extractSections(text);

      logger.info(`PDF parsed successfully: ${pageCount} pages, ${wordCount} words`);

      return {
        text,
        pageCount,
        wordCount,
        sections
      };
    } catch (error) {
      logger.error('Error parsing PDF:', error);
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract sections from text based on headers
   */
  private static extractSections(text: string): Array<{ title: string; content: string }> {
    const sections: Array<{ title: string; content: string }> = [];
    
    // Split by common section markers
    const lines = text.split('\n');
    let currentSection: { title: string; content: string } | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check if line is a header (all caps, or ends with colon, or starts with number)
      const isHeader = /^[A-Z\s]{5,}$/.test(trimmed) || 
                      /^[\d.]+\s+[A-Z]/.test(trimmed) ||
                      /:$/.test(trimmed);

      if (isHeader && trimmed.length > 0 && trimmed.length < 100) {
        // Save previous section
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Start new section
        currentSection = {
          title: trimmed.replace(/:$/, ''),
          content: ''
        };
      } else if (currentSection && trimmed.length > 0) {
        currentSection.content += trimmed + '\n';
      }
    }

    // Add last section
    if (currentSection) {
      sections.push(currentSection);
    }

    return sections.filter(s => s.content.length > 20);
  }

  /**
   * Extract requirements from parsed text
   */
  static extractRequirements(text: string): Array<{ program: string; criteria: Record<string, any> }> {
    const requirements: Array<{ program: string; criteria: Record<string, any> }> = [];

    // Look for Business program requirements
    const businessMatch = text.match(/Business.*?(?:Requirements|Criteria)[:\s]+([\s\S]*?)(?=Computer Science|$)/i);
    if (businessMatch) {
      requirements.push({
        program: 'Business',
        criteria: this.parseCriteria(businessMatch[1])
      });
    }

    // Look for Computer Science program requirements
    const csMatch = text.match(/Computer Science.*?(?:Requirements|Criteria)[:\s]+([\s\S]*?)(?=Business|$)/i);
    if (csMatch) {
      requirements.push({
        program: 'Computer Science',
        criteria: this.parseCriteria(csMatch[1])
      });
    }

    return requirements;
  }

  /**
   * Parse criteria from text
   */
  private static parseCriteria(text: string): Record<string, any> {
    const criteria: Record<string, any> = {};

    // Extract GPA requirements
    const gpaMatch = text.match(/GPA[:\s]+(\d+\.?\d*)/i);
    if (gpaMatch) {
      criteria.minimumGPA = parseFloat(gpaMatch[1]);
    }

    // Extract test score requirements
    const satMatch = text.match(/SAT[:\s]+(\d+)/i);
    if (satMatch) {
      criteria.minimumSAT = parseInt(satMatch[1]);
    }

    const actMatch = text.match(/ACT[:\s]+(\d+)/i);
    if (actMatch) {
      criteria.minimumACT = parseInt(actMatch[1]);
    }

    const greMatch = text.match(/GRE[:\s]+(\d+)/i);
    if (greMatch) {
      criteria.minimumGRE = parseInt(greMatch[1]);
    }

    // Extract work experience
    const workMatch = text.match(/work experience[:\s]+(\d+)/i);
    if (workMatch) {
      criteria.minimumWorkExperience = parseInt(workMatch[1]);
    }

    return criteria;
  }

  /**
   * Cleanup uploaded file
   */
  static async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      logger.info(`File deleted: ${filePath}`);
    } catch (error) {
      logger.error('Error deleting file:', error);
    }
  }
}
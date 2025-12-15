// backend/src/services/interviewFlow.ts
/**
 * Dynamic interview flow - adapts to knowledge base requirements
 * No more hardcoded questions!
 */

import {ProgramRequirements } from './requirementsParser';

export interface CollectedData {
  name?: string;
  gpa?: number;
  age?: number;
  testScores?: {
    sat?: number;
    act?: number;
    gre?: number;
    gmat?: number;
  };
  workExperience?: number;
  major?: string;
  program?: string;
}

export class InterviewFlow {
  /**
   * Get next question dynamically based on KB requirements
   */
  static getNextQuestion(
    program: string,
    collectedData: CollectedData,
    programRequirements: ProgramRequirements | null
  ): string {
    console.log('InterviewFlow.getNextQuestion', { program, collectedData, programRequirements });
    
    // Always ask for name first
    if (!collectedData.name) {
      return "Thank you for your interest! May I have your full name to get started?";
    }

    // If we have parsed requirements, use them dynamically
    if (programRequirements && programRequirements.fields) {
      for (const field of programRequirements.fields) {
        const fieldName = field.name;
        
        // Check if this field is collected
        if (fieldName === 'gpa' && !collectedData.gpa) {
          return field.question;
        }
        
        if (fieldName === 'age' && !collectedData.age) {
          return field.question;
        }
        
        if (fieldName === 'sat' && !collectedData.testScores?.sat && !collectedData.testScores?.act) {
          return field.question;
        }
        
        if (fieldName === 'act' && !collectedData.testScores?.act && !collectedData.testScores?.sat) {
          return field.question;
        }
        
        if (fieldName === 'gre' && !collectedData.testScores?.gre) {
          return field.question;
        }
        
        if (fieldName === 'gmat' && !collectedData.testScores?.gmat) {
          return field.question;
        }
        
        if (fieldName === 'workExperience' && collectedData.workExperience === undefined) {
          return field.question;
        }
      }
    } else {
      // Fallback to generic questions if no requirements parsed
      if (!collectedData.gpa) {
        return "What is your current cumulative GPA on a 4.0 scale?";
      }
      
      if (!collectedData.age) {
        return "What is your age?";
      }
      
      // Ask for SAT/ACT
      if (!collectedData.testScores?.sat && !collectedData.testScores?.act) {
        return "Do you have SAT or ACT scores? Please provide whichever test you took and your score.";
      }
    }
    
    // All data collected!
    console.log('All required data collected - ready to evaluate!');
    return "";
  }

  /**
   * Extract data from user message with comprehensive pattern matching
   */
  static extractDataFromMessage(
    message: string,
    program: string,
    currentData: CollectedData
  ): { updates: any; extracted: string[] } {  // Return 'any' for database updates
    const updates: any = {};  // Changed to any for database field names
    const extracted: string[] = [];
    const lowerMessage = message.toLowerCase();

    console.log('Extracting from message:', message);

    // 1. Extract NAME - if first message, short, and looks like a name
    if (!currentData.name) {
      const trimmed = message.trim();
      console.log('Checking name extraction:', { 
        trimmed, 
        length: trimmed.length, 
        wordCount: trimmed.split(' ').length,
        hasDigits: /^\d+$/.test(trimmed),
        currentHasName: !!currentData.name
      });
      
      // Name criteria: 2-50 chars, max 4 words, not ONLY numbers
      if (trimmed.length >= 2 && trimmed.length <= 50 && 
          trimmed.split(' ').length <= 4 && 
          !/^\d+$/.test(trimmed)) {
        updates.studentName = trimmed;  // Use studentName for database!
        extracted.push(`name: ${trimmed}`);
        console.log('NAME EXTRACTED:', trimmed);
      } else {
        console.log('❌ Name criteria not met');
      }
    } else {
      console.log('Name already collected:', currentData.name);
    }

    // 2. Extract GPA - multiple pattern variations
    if (!currentData.gpa) {
      const gpaPatterns = [
        /\b([0-3]\.\d{1,2}|4\.0{1,2})\b/,           // Just the number: 3.9
        /gpa[:\s]+([0-3]\.\d{1,2}|4\.0)/i,          // "GPA: 3.9"
        /my\s+gpa\s+is\s+([0-3]\.\d{1,2}|4\.0)/i,   // "My GPA is 3.8"
        /i\s+have\s+(?:a\s+)?([0-3]\.\d{1,2}|4\.0)/i // "I have a 3.7"
      ];

      for (const pattern of gpaPatterns) {
        const match = message.match(pattern);
        if (match) {
          const gpa = parseFloat(match[1]);
          if (gpa >= 0 && gpa <= 4.0) {
            updates.gpa = gpa;
            extracted.push(`GPA: ${gpa}`);
            break;
          }
        }
      }
    }

    // Initialize testScores if needed
    if (!updates.testScores && !currentData.testScores) {
      updates.testScores = {};
    }
    const testScores: any = updates.testScores || { ...currentData.testScores } || {};

    // 3. Extract SAT (400-1600 range)
    if (!currentData.testScores?.sat) {
      const satPatterns = [
        /sat[:\s]+(\d{3,4})/i,
        /scored?\s+(\d{3,4})\s+(?:on\s+)?sat/i,
        /my\s+sat\s+(?:is|was)\s+(\d{3,4})/i
      ];

      for (const pattern of satPatterns) {
        const match = message.match(pattern);
        if (match) {
          const score = parseInt(match[1]);
          if (score >= 400 && score <= 1600) {
            testScores.sat = score;
            updates.testScores = testScores;
            extracted.push(`SAT: ${score}`);
            break;
          }
        }
      }

      // Fallback: 4-digit number in SAT range if "sat" mentioned
      if (!testScores.sat && lowerMessage.includes('sat')) {
        const numberMatch = message.match(/\b(1[0-6]\d{2}|[4-9]\d{2})\b/);
        if (numberMatch) {
          const score = parseInt(numberMatch[1]);
          if (score >= 400 && score <= 1600) {
            testScores.sat = score;
            updates.testScores = testScores;
            extracted.push(`SAT (fallback): ${score}`);
          }
        }
      }
    }

    // 4. Extract ACT (1-36 range)
    if (!currentData.testScores?.act) {
      const actPatterns = [
        /act[:\s]+(\d{1,2})/i,
        /scored?\s+(\d{1,2})\s+(?:on\s+)?act/i,
        /my\s+act\s+(?:is|was)\s+(\d{1,2})/i
      ];

      for (const pattern of actPatterns) {
        const match = message.match(pattern);
        if (match) {
          const score = parseInt(match[1]);
          if (score >= 1 && score <= 36) {
            testScores.act = score;
            updates.testScores = testScores;
            extracted.push(`ACT: ${score}`);
            break;
          }
        }
      }

      // Fallback: 1-2 digit number in ACT range if "act" mentioned
      if (!testScores.act && lowerMessage.includes('act')) {
        const numberMatch = message.match(/\b([1-3]?\d)\b/);
        if (numberMatch) {
          const score = parseInt(numberMatch[1]);
          if (score >= 1 && score <= 36) {
            testScores.act = score;
            updates.testScores = testScores;
            extracted.push(`ACT (fallback): ${score}`);
          }
        }
      }
    }

    // 5. Extract AGE
    if (!currentData.age) {
      const agePatterns = [
        /(?:i am|i'm|age is)\s+(\d{1,2})\s*(?:years old)?/i,
        /^(\d{1,2})$/,  // Just a number
        /age[:\s]+(\d{1,2})/i
      ];

      for (const pattern of agePatterns) {
        const match = message.match(pattern);
        if (match) {
          const age = parseInt(match[1]);
          if (age >= 10 && age <= 100) {
            updates.age = age;
            extracted.push(`age: ${age}`);
            break;
          }
        }
      }
    }

    // 6. Extract GMAT (for Business)
    if (program === 'Business' && !currentData.testScores?.gmat) {
      const gmatPatterns = [
        /gmat[:\s]+(\d{3})/i,
        /scored?\s+(\d{3})\s+(?:on\s+)?gmat/i,
        /my\s+gmat\s+(?:is|was)\s+(\d{3})/i,
        /\b([2-8]\d{2})\b/ // Any 3-digit number 200-800
      ];

      for (const pattern of gmatPatterns) {
        const match = message.match(pattern);
        if (match) {
          const score = parseInt(match[1]);
          if (score >= 200 && score <= 800) {
            testScores.gmat = score;
            updates.testScores = testScores;
            extracted.push(`GMAT: ${score}`);
            break;
          }
        }
      }
    }

    // 4. Extract GRE (for Computer Science) - COMPREHENSIVE
    if (program === 'Computer Science' && !currentData.testScores?.gre) {
      // Pattern 1: Separate Quant and Verbal scores
      const quantPatterns = [
        /(?:quant|quantitative|q)[:\s-]+(\d{3})/i,
        /(\d{3})[,\s-]+(?:quant|quantitative)/i,
      ];
      
      const verbalPatterns = [
        /(?:verbal|v)[:\s-]+(\d{3})/i,
        /(\d{3})[,\s-]+(?:verbal)/i,
      ];

      let quant: number | null = null;
      let verbal: number | null = null;

      // Try to find Quant score
      for (const pattern of quantPatterns) {
        const match = message.match(pattern);
        if (match) {
          const score = parseInt(match[1]);
          if (score >= 130 && score <= 170) {
            quant = score;
            break;
          }
        }
      }

      // Try to find Verbal score
      for (const pattern of verbalPatterns) {
        const match = message.match(pattern);
        if (match) {
          const score = parseInt(match[1]);
          if (score >= 130 && score <= 170) {
            verbal = score;
            break;
          }
        }
      }

      // If both found, calculate combined
      if (quant && verbal) {
        const combined = quant + verbal;
        testScores.gre = combined;
        updates.testScores = testScores;
        extracted.push(`GRE: Quant ${quant} + Verbal ${verbal} = ${combined}`);
      } else {
        // Pattern 2: Combined score
        const grePatterns = [
          /gre[:\s]+(\d{3})/i,
          /scored?\s+(\d{3})\s+(?:on\s+)?gre/i,
          /my\s+gre\s+(?:is|was)\s+(\d{3})/i,
          /\b([2-3]\d{2})\b/ // Any 3-digit number 260-340
        ];

        for (const pattern of grePatterns) {
          const match = message.match(pattern);
          if (match) {
            const score = parseInt(match[1]);
            if (score >= 260 && score <= 340) {
              testScores.gre = score;
              updates.testScores = testScores;
              extracted.push(`GRE: ${score}`);
              break;
            }
          }
        }
      }
    }

    // 5. Extract Work Experience
    if (program === 'Business' && (currentData.workExperience === undefined || currentData.workExperience === null)) {
      const workPatterns = [
        /(\d+)\s*(?:years?|yrs?)\s+(?:of\s+)?(?:work\s+)?(?:experience)?/i,
        /(?:experience|worked)[:\s]+(\d+)\s*(?:years?|yrs?)/i,
        /i\s+have\s+(\d+)\s*(?:years?|yrs?)/i,
        /^\s*(\d+)\s*(?:years?|yrs?)?\s*$/i // Just a number
      ];

      for (const pattern of workPatterns) {
        const match = message.match(pattern);
        if (match) {
          const years = parseInt(match[1]);
          if (years >= 0 && years <= 50) {
            updates.workExperience = years;
            extracted.push(`Work experience: ${years} years`);
            break;
          }
        }
      }

      // Fallback: If message is just a number between 0-20
      if (updates.workExperience === undefined) {
        const justNumber = message.trim();
        if (/^\d+$/.test(justNumber)) {
          const years = parseInt(justNumber);
          if (years >= 0 && years <= 20) {
            updates.workExperience = years;
            extracted.push(`Work experience (number only): ${years} years`);
          }
        }
      }
    }

    console.log('Extraction results:', { updates, extracted });

    return { updates, extracted };
  }

  /**
   * Check which fields are still missing
   */
  static getMissingFields(program: string, data: CollectedData): string[] {
    const missing: string[] = [];

    if (!data.name) missing.push('name');
    if (!data.gpa) missing.push('gpa');

    if (program === 'Business') {
      if (!data.testScores?.gmat) missing.push('gmat');
      if (data.workExperience === undefined || data.workExperience === null) missing.push('workExperience');
    } else if (program === 'Computer Science') {
      const hasValidGRE = data.testScores?.gre && data.testScores.gre >= 260;
      if (!hasValidGRE) missing.push('gre');
    }

    return missing;
  }

  /**
   * Check if all required data is collected
   */
  static isDataComplete(program: string, data: CollectedData): boolean {
    return this.getMissingFields(program, data).length === 0;
  }
}
// backend/src/services/requirementsParser.ts
/**
 * Dynamically parse requirements from knowledge base
 * Adapts to ANY uploaded PDF
 */

export interface ProgramRequirements {
  program: string;
  fields: RequirementField[];
  criteria: {
    minimumGPA?: number;
    testScores?: {
      satMin?: number;
      actMin?: number;
      greMin?: number;
      gmatMin?: number;
    };
    age?: number;
    other?: string[];
  };
}

export interface RequirementField {
  name: string;
  type: 'number' | 'text' | 'boolean';
  required: boolean;
  question: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export class RequirementsParser {
  /**
   * Parse requirements from knowledge base text
   */
  static parseRequirements(kbText: string): ProgramRequirements[] {
    const requirements: ProgramRequirements[] = [];

    // Extract Business Program requirements
    const businessSection = this.extractProgramSection(kbText, 'Business');
    if (businessSection) {
      requirements.push(this.parseProgramRequirements('Business', businessSection));
    }

    // Extract Computer Science Program requirements
    const csSection = this.extractProgramSection(kbText, 'Computer Science');
    if (csSection) {
      requirements.push(this.parseProgramRequirements('Computer Science', csSection));
    }

    return requirements;
  }

  /**
   * Extract text section for a specific program
   */
  private static extractProgramSection(text: string, program: string): string {
    const patterns = [
      new RegExp(`${program}.*?Program.*?Requirements([\\s\\S]*?)(?=(?:Computer Science|Business).*?Program|$)`, 'i'),
      new RegExp(`${program}.*?–.*?Requirements([\\s\\S]*?)(?=💻|🎓|$)`, 'i')
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return '';
  }

  /**
   * Parse individual program requirements
   */
  private static parseProgramRequirements(program: string, sectionText: string): ProgramRequirements {
    const fields: RequirementField[] = [];
    const criteria: any = {};

    // Extract GPA requirement
    const gpaMatch = sectionText.match(/GPA.*?(\d+\.?\d*)\s+(?:on\s+)?(?:a\s+)?4\.0/i);
    if (gpaMatch) {
      criteria.minimumGPA = parseFloat(gpaMatch[1]);
      fields.push({
        name: 'gpa',
        type: 'number',
        required: true,
        question: `What is your current cumulative GPA on a 4.0 scale?`,
        validation: { min: 0, max: 4.0 }
      });
    }

    // Extract age requirement
    const ageMatch = sectionText.match(/(?:at least|minimum age of|must be)\s+(\d+)\s+years old/i);
    if (ageMatch) {
      criteria.age = parseInt(ageMatch[1]);
      fields.push({
        name: 'age',
        type: 'number',
        required: true,
        question: `What is your age?`,
        validation: { min: parseInt(ageMatch[1]), max: 100 }
      });
    }

    // Extract SAT requirement
    const satMatch = sectionText.match(/SAT.*?(?:minimum|at least|score of)\s+(\d+)/i);
    if (satMatch) {
      if (!criteria.testScores) criteria.testScores = {};
      criteria.testScores.satMin = parseInt(satMatch[1]);
      
      fields.push({
        name: 'sat',
        type: 'number',
        required: false, // Usually SAT OR ACT
        question: `What was your SAT score? (Skip if you took ACT instead)`,
        validation: { min: 400, max: 1600 }
      });
    }

    // Extract ACT requirement
    const actMatch = sectionText.match(/ACT.*?(?:minimum|at least|score of)\s+(\d+)/i);
    if (actMatch) {
      if (!criteria.testScores) criteria.testScores = {};
      criteria.testScores.actMin = parseInt(actMatch[1]);
      
      fields.push({
        name: 'act',
        type: 'number',
        required: false, // Usually SAT OR ACT
        question: `What was your ACT score? (Skip if you took SAT instead)`,
        validation: { min: 1, max: 36 }
      });
    }

    // Extract GRE requirement
    const greMatch = sectionText.match(/GRE.*?(?:minimum|at least|score of)\s+(\d+)/i);
    if (greMatch) {
      if (!criteria.testScores) criteria.testScores = {};
      criteria.testScores.greMin = parseInt(greMatch[1]);
      
      fields.push({
        name: 'gre',
        type: 'number',
        required: true,
        question: `What was your GRE score? (Combined Quantitative and Verbal)`,
        validation: { min: 260, max: 340 }
      });
    }

    // Extract GMAT requirement
    const gmatMatch = sectionText.match(/GMAT.*?(?:minimum|at least|score of)\s+(\d+)/i);
    if (gmatMatch) {
      if (!criteria.testScores) criteria.testScores = {};
      criteria.testScores.gmatMin = parseInt(gmatMatch[1]);
      
      fields.push({
        name: 'gmat',
        type: 'number',
        required: true,
        question: `What was your GMAT score?`,
        validation: { min: 200, max: 800 }
      });
    }

    // Extract work experience requirement
    const workMatch = sectionText.match(/(?:work experience|professional experience).*?(?:minimum|at least)\s+(\d+)\s+year/i);
    if (workMatch) {
      criteria.minimumWorkExperience = parseInt(workMatch[1]);
      
      fields.push({
        name: 'workExperience',
        type: 'number',
        required: true,
        question: `How many years of professional work experience do you have?`,
        validation: { min: 0, max: 50 }
      });
    }

    // Check for other requirements
    if (sectionText.match(/high school diploma/i)) {
      criteria.other = criteria.other || [];
      criteria.other.push('High school diploma required');
    }

    if (sectionText.match(/personal statement|essay/i)) {
      criteria.other = criteria.other || [];
      criteria.other.push('Personal statement required');
    }

    if (sectionText.match(/recommendation/i)) {
      criteria.other = criteria.other || [];
      criteria.other.push('Recommendation letter required');
    }

    return {
      program,
      fields,
      criteria
    };
  }

  /**
   * Get required fields for a program based on parsed requirements
   */
  static getRequiredFields(programReqs: ProgramRequirements): string[] {
    return programReqs.fields
      .filter(f => f.required)
      .map(f => f.name);
  }

  /**
   * Get question for a specific field
   */
  static getQuestionForField(programReqs: ProgramRequirements, fieldName: string): string {
    const field = programReqs.fields.find(f => f.name === fieldName);
    return field?.question || `Please provide your ${fieldName}`;
  }

  /**
   * Validate collected data against requirements
   */
  static validateAgainstRequirements(
    programReqs: ProgramRequirements,
    collectedData: Record<string, any>
  ): { isValid: boolean; reason: string } {
    // Check GPA
    if (programReqs.criteria.minimumGPA && collectedData.gpa) {
      if (collectedData.gpa < programReqs.criteria.minimumGPA) {
        return {
          isValid: false,
          reason: `GPA of ${collectedData.gpa} is below minimum requirement of ${programReqs.criteria.minimumGPA}`
        };
      }
    }

    // Check test scores (SAT, ACT, GRE, GMAT)
    if (programReqs.criteria.testScores) {
      const { satMin, actMin, greMin, gmatMin } = programReqs.criteria.testScores;
      
      // SAT
      if (satMin && collectedData.testScores?.sat) {
        if (collectedData.testScores.sat < satMin) {
          return {
            isValid: false,
            reason: `SAT score of ${collectedData.testScores.sat} is below minimum of ${satMin}`
          };
        }
      }

      // ACT
      if (actMin && collectedData.testScores?.act) {
        if (collectedData.testScores.act < actMin) {
          return {
            isValid: false,
            reason: `ACT score of ${collectedData.testScores.act} is below minimum of ${actMin}`
          };
        }
      }

      // GRE
      if (greMin && collectedData.testScores?.gre) {
        if (collectedData.testScores.gre < greMin) {
          return {
            isValid: false,
            reason: `GRE score of ${collectedData.testScores.gre} is below minimum of ${greMin}`
          };
        }
      }

      // GMAT
      if (gmatMin && collectedData.testScores?.gmat) {
        if (collectedData.testScores.gmat < gmatMin) {
          return {
            isValid: false,
            reason: `GMAT score of ${collectedData.testScores.gmat} is below minimum of ${gmatMin}`
          };
        }
      }

      // Check if at least one test score is provided (SAT OR ACT)
      if ((satMin || actMin) && !collectedData.testScores?.sat && !collectedData.testScores?.act) {
        return {
          isValid: false,
          reason: 'Either SAT or ACT score is required'
        };
      }
    }

    // Check age
    if (programReqs.criteria.age && collectedData.age) {
      if (collectedData.age < programReqs.criteria.age) {
        return {
          isValid: false,
          reason: `Applicant must be at least ${programReqs.criteria.age} years old`
        };
      }
    }

    // Check work experience
    if (programReqs.criteria.minimumWorkExperience !== undefined && collectedData.workExperience !== undefined) {
      if (collectedData.workExperience < programReqs.criteria.minimumWorkExperience) {
        return {
          isValid: false,
          reason: `Requires minimum ${programReqs.criteria.minimumWorkExperience} years of work experience`
        };
      }
    }

    // All checks passed
    return {
      isValid: true,
      reason: 'All requirements met'
    };
  }
}
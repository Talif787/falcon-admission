// backend/src/services/comprehensiveRequirements.ts
// BULLETPROOF VERSION - Knows which question was just asked

export interface ComprehensiveData {
  name?: string;
  age?: number;
  gpa?: number;
  highSchoolDiploma?: boolean;
  mathCourses?: boolean;
  testScores?: {
    sat?: number;
    act?: number;
    toefl?: number;
    ielts?: number;
    duolingo?: number;
  };
  isInternational?: boolean;
  personalStatement?: boolean;
  recommendationLetter?: boolean;
  program?: string;
}

export class ComprehensiveRequirements {
  /**
   * Get next question and return which field it's asking for
   */
  static getNextQuestion(
    program: string,
    data: ComprehensiveData
  ): { question: string; field: string } {
    console.log('Checking what to ask next...');
    console.log('Current data:', data);

    if (!data.name) {
      return { question: 'May I have your full name?', field: 'name' };
    }

    if (!data.age) {
      return { question: 'What is your age?', field: 'age' };
    }

    if (!data.gpa) {
      return {
        question: 'What is your current cumulative GPA on a 4.0 scale?',
        field: 'gpa',
      };
    }

    if (data.highSchoolDiploma === undefined) {
      return {
        question: 'Have you completed high school or obtained a diploma? (yes/no)',
        field: 'diploma',
      };
    }

    if (program === 'Computer Science' && data.mathCourses === undefined) {
      return {
        question: 'Have you completed advanced math courses like calculus or algebra? (yes/no)',
        field: 'math',
      };
    }

    if (!data.testScores?.sat && !data.testScores?.act) {
      return {
        question: 'Which test did you take - SAT or ACT? Provide your score.',
        field: 'test',
      };
    }

    if (data.isInternational === undefined) {
      console.log('INTERNATIONAL STATUS IS UNDEFINED - ASKING NOW');
      return { question: 'Are you an international student? (yes/no)', field: 'international' };
    }

    if (
      data.isInternational === true &&
      !data.testScores?.toefl &&
      !data.testScores?.ielts &&
      !data.testScores?.duolingo
    ) {
      return { question: 'Provide TOEFL, IELTS, or Duolingo score.', field: 'english' };
    }

    if (data.personalStatement === undefined) {
      return { question: 'Will you submit a personal statement? (yes/no)', field: 'statement' };
    }

    if (data.recommendationLetter === undefined) {
      return {
        question: 'Will you submit a recommendation letter? (yes/no)',
        field: 'recommendation',
      };
    }

    return { question: '', field: '' };
  }

  /**
   * Extract data - ONLY sets the field corresponding to the last question
   */
  static extractFromMessage(
    message: string,
    currentData: ComprehensiveData,
    program: string,
    currentField: string
  ): any {
    const updates: any = {};
    const lower = message.toLowerCase();

    console.log('EXTRACTING FOR FIELD:', currentField);
    console.log('Message:', message);

    const isYes = /\b(yes|yeah|yep|y|sure)\b/i.test(message);
    const isNo = /\b(no|nope|n|not)\b/i.test(message);

    // Helper: only update boolean if user clearly answered yes/no
    const ynToBool = (): boolean | undefined => {
      if (isYes) return true;
      if (isNo) return false;
      return undefined;
    };

    // Extract based on CURRENT FIELD ONLY
    switch (currentField) {
      case 'name': {
        if (message.length < 50 && !/^\d+$/.test(message) && !/^(yes|no)$/i.test(message)) {
          updates.studentName = message.trim();
          console.log('NAME:', message.trim());
        }
        break;
      }

      case 'age': {
        const ageMatch = message.match(/\b(\d{2})\b/);
        if (ageMatch) {
          const age = parseInt(ageMatch[1], 10);
          if (age >= 16 && age <= 99) {
            updates.age = age;
            console.log('AGE:', age);
          }
        }
        break;
      }

      case 'gpa': {
        const gpaMatch = message.match(/\b([0-3]\.\d+|4\.0)\b/);
        if (gpaMatch) {
          updates.gpa = parseFloat(gpaMatch[1]);
          console.log('GPA:', updates.gpa);
        }
        break;
      }

      case 'diploma': {
        const v = ynToBool();
        if (v !== undefined) {
          updates.highSchoolDiploma = v;
          console.log('DIPLOMA:', v);
        }
        break;
      }

      case 'math': {
        const v = ynToBool();
        if (v !== undefined) {
          updates.mathCourses = v;
          console.log('MATH:', v);
        }
        break;
      }

      case 'test': {
        // Merge existing scores instead of overwriting them
        updates.testScores = { ...(currentData.testScores ?? {}) };

        if (lower.includes('sat')) {
          const match = message.match(/\b(\d{3,4})\b/);
          if (match) {
            const sat = parseInt(match[1], 10);
            // SAT range sanity check; keep program param "used" meaningfully
            if (sat >= 400 && sat <= 1600) {
              updates.testScores.sat = sat;
              console.log('SAT:', sat, 'Program:', program);
            }
          }
        } else if (lower.includes('act')) {
          const match = message.match(/\b(\d{1,2})\b/);
          if (match) {
            const act = parseInt(match[1], 10);
            if (act >= 1 && act <= 36) {
              updates.testScores.act = act;
              console.log('ACT:', act, 'Program:', program);
            }
          }
        }
        break;
      }

      case 'international': {
        const v = ynToBool();
        if (v !== undefined) {
          updates.isInternational = v;
          console.log('INTERNATIONAL:', v, '(only setting this field now)');
        }
        break;
      }

      case 'english': {
        updates.testScores = { ...(currentData.testScores ?? {}) };

        if (lower.includes('toefl')) {
          const match = message.match(/\b(\d{2,3})\b/);
          if (match) updates.testScores.toefl = parseInt(match[1], 10);
        } else if (lower.includes('ielts')) {
          const match = message.match(/\b(\d+\.?\d*)\b/);
          if (match) updates.testScores.ielts = parseFloat(match[1]);
        } else if (lower.includes('duolingo')) {
          const match = message.match(/\b(\d{2,3})\b/);
          if (match) updates.testScores.duolingo = parseInt(match[1], 10);
        }
        break;
      }

      case 'statement': {
        const v = ynToBool();
        if (v !== undefined) {
          updates.personalStatement = v;
          console.log('STATEMENT:', v);
        }
        break;
      }

      case 'recommendation': {
        const v = ynToBool();
        if (v !== undefined) {
          updates.recommendationLetter = v;
          console.log('RECOMMENDATION:', v);
        }
        break;
      }
    }

    console.log('Updates:', updates);
    return updates;
  }

  static buildData(applicant: any): ComprehensiveData {
    return {
      name: applicant.studentName !== 'Anonymous' ? applicant.studentName : undefined,
      age: applicant.age,
      gpa: applicant.gpa,
      highSchoolDiploma: applicant.highSchoolDiploma,
      mathCourses: applicant.mathCourses,
      testScores: applicant.testScores,
      isInternational: applicant.isInternational,
      personalStatement: applicant.personalStatement,
      recommendationLetter: applicant.recommendationLetter,
      program: applicant.program,
    };
  }

  static getMissingFields(program: string, data: ComprehensiveData): string[] {
    const missing: string[] = [];

    if (!data.name) missing.push('name');
    if (!data.age) missing.push('age');
    if (!data.gpa) missing.push('gpa');
    if (data.highSchoolDiploma === undefined) missing.push('diploma');
    if (program === 'Computer Science' && data.mathCourses === undefined) missing.push('math');
    if (!data.testScores?.sat && !data.testScores?.act) missing.push('test');
    if (data.isInternational === undefined) missing.push('international');
    if (
      data.isInternational === true &&
      !data.testScores?.toefl &&
      !data.testScores?.ielts &&
      !data.testScores?.duolingo
    )
      missing.push('english');
    if (data.personalStatement === undefined) missing.push('statement');
    if (data.recommendationLetter === undefined) missing.push('recommendation');

    return missing;
  }

  static evaluateComprehensive(program: string, data: ComprehensiveData, _kbText: string) {
    // Same evaluation logic as before
    const passed: string[] = [];
    const failed: string[] = [];

    // NOTE: removed unused "section" variable (was not referenced)

    const minGPA = program === 'Computer Science' ? 3.3 : 3.0;
    const minSAT = program === 'Computer Science' ? 1300 : 1200;
    const minACT = program === 'Computer Science' ? 29 : 27;

    if (data.age! >= 16) passed.push(`Age ${data.age} ≥ 16`);
    else failed.push(`Age ${data.age} < 16`);

    if (data.highSchoolDiploma) passed.push('High school diploma met');
    else failed.push('High school diploma required');

    if (data.gpa! >= minGPA) passed.push(`GPA ${data.gpa} ≥ ${minGPA}`);
    else failed.push(`GPA ${data.gpa} < ${minGPA}`);

    if (program === 'Computer Science') {
      if (data.mathCourses) passed.push('Math courses met');
      else failed.push('Advanced math required');
    }

    if (data.testScores?.sat && data.testScores.sat >= minSAT) {
      passed.push(`SAT ${data.testScores.sat} ≥ ${minSAT}`);
    } else if (data.testScores?.act && data.testScores.act >= minACT) {
      passed.push(`ACT ${data.testScores.act} ≥ ${minACT}`);
    } else {
      failed.push(`SAT ≥ ${minSAT} or ACT ≥ ${minACT} required`);
    }

    if (data.isInternational === true) {
      const hasTOEFL = data.testScores?.toefl && data.testScores.toefl >= 95;
      const hasIELTS = data.testScores?.ielts && data.testScores.ielts >= 7.0;
      const hasDuolingo = data.testScores?.duolingo && data.testScores.duolingo >= 120;

      if (hasTOEFL || hasIELTS || hasDuolingo) {
        passed.push('English proficiency met');
      } else {
        failed.push('TOEFL/IELTS/Duolingo required');
      }
    }

    if (data.personalStatement) passed.push('Personal statement will be submitted');
    else failed.push('Personal statement required');

    if (data.recommendationLetter) passed.push('Recommendation letter will be submitted');
    else failed.push('Recommendation required');

    const meetsAll = failed.length === 0;
    return {
      result: meetsAll ? ('Meets Criteria' as const) : ('Criteria Not Met' as const),
      summary: meetsAll ? `All ${passed.length} requirements met` : `${failed.length} requirements not met`,
      details: [...passed, ...failed],
    };
  }
}

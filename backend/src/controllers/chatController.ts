// backend/src/controllers/chatController.ts
// FINAL VERSION - Explicitly skips English tests if not international

import { Request, Response } from 'express';
import { ApplicantService } from '../services/applicantService';

export class ChatController {
  initializeChat = async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    const app = await ApplicantService.getApplicantBySessionId(sessionId);
    if (!app) {
      return res.status(404).json({ success: false });
    }

    const greeting = 'Welcome! Which program - Business or Computer Science?';
    await ApplicantService.addMessageToTranscript(sessionId, 'assistant', greeting);

    return res.json({ success: true, data: { message: greeting, sessionId } });
  };

  sendMessage = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { message, program } = req.body;

    let app = await ApplicantService.getApplicantBySessionId(sessionId);
    if (!app) {
      return res.status(404).json({ success: false });
    }

    await ApplicantService.addMessageToTranscript(sessionId, 'user', message);

    if (program) {
      await ApplicantService.updateApplicant(sessionId, { program });
      app.program = program;
    }

    const msg = String(message ?? '').toLowerCase().trim();
    const save: any = {};

    // 1. Name (if still Anonymous)
    if (app.studentName === 'Anonymous') {
      if (message.length < 30 && !/^\d/.test(message) && !/^(yes|no)$/i.test(message)) {
        save.studentName = message.trim();
      }
    }
    // 2. Age
    else if (!app.age) {
      if (/^\d{2}$/.test(message)) {
        save.age = parseInt(message, 10);
      }
    }
    // 3. GPA
    else if (!app.gpa) {
      const m = message.match(/([0-3]\.\d+|4\.0)/);
      if (m) save.gpa = parseFloat(m[1]);
    }
    // 4. High school diploma
    else if (app.highSchoolDiploma === undefined) {
      save.highSchoolDiploma = /\b(yes|y|yeah)\b/i.test(message);
    }
    // 5. Math courses (CS only)
    else if (app.program === 'Computer Science' && app.mathCourses === undefined) {
      save.mathCourses = /\b(yes|y|yeah)\b/i.test(message);
    }
    // 6. SAT/ACT
    else if (!app.testScores?.sat && !app.testScores?.act) {
      if (msg.includes('sat')) {
        const m = message.match(/(\d{4})/);
        if (m) save.testScores = { sat: parseInt(m[1], 10) };
      } else if (msg.includes('act')) {
        const m = message.match(/(\d{1,2})/);
        if (m && parseInt(m[1], 10) <= 36) save.testScores = { act: parseInt(m[1], 10) };
      }
    }
    // 7. International status
    else if (app.isInternational === undefined) {
      save.isInternational = /\b(yes|y|yeah)\b/i.test(message);
      console.log('SETTING INTERNATIONAL TO:', save.isInternational);
    }
    // 8. English tests (ONLY if international === true)
    else if (app.isInternational === true && !app.testScores?.toefl && !app.testScores?.ielts) {
      if (msg.includes('toefl')) {
        const m = message.match(/(\d{2,3})/);
        if (m) {
          if (!save.testScores) save.testScores = app.testScores || {};
          save.testScores.toefl = parseInt(m[1], 10);
        }
      } else if (msg.includes('ielts')) {
        const m = message.match(/(\d+\.?\d*)/);
        if (m) {
          if (!save.testScores) save.testScores = app.testScores || {};
          save.testScores.ielts = parseFloat(m[1]);
        }
      }
    }
    // 9. Personal statement
    else if (app.personalStatement === undefined) {
      save.personalStatement = /\b(yes|y|yeah)\b/i.test(message);
    }
    // 10. Recommendation
    else if (app.recommendationLetter === undefined) {
      save.recommendationLetter = /\b(yes|y|yeah)\b/i.test(message);
    }

    if (Object.keys(save).length > 0) {
      await ApplicantService.updateApplicant(sessionId, save);
      console.log('SAVED:', save);
    }

    app = (await ApplicantService.getApplicantBySessionId(sessionId))!;
    console.log('CURRENT STATE:', {
      name: app.studentName,
      age: app.age,
      gpa: app.gpa,
      diploma: app.highSchoolDiploma,
      math: app.mathCourses,
      sat: app.testScores?.sat,
      international: app.isInternational,
      toefl: app.testScores?.toefl,
      statement: app.personalStatement,
      rec: app.recommendationLetter,
    });

    // NEXT QUESTION - EXPLICIT LOGIC
    let next = '';

    if (app.studentName === 'Anonymous') {
      next = 'Name?';
    } else if (!app.age) {
      next = 'Age?';
    } else if (!app.gpa) {
      next = 'GPA?';
    } else if (app.highSchoolDiploma === undefined) {
      next = 'High school diploma? (yes/no)';
    } else if (app.program === 'Computer Science' && app.mathCourses === undefined) {
      next = 'Advanced math courses? (yes/no)';
    } else if (!app.testScores?.sat && !app.testScores?.act) {
      next = 'SAT or ACT score?';
    } else if (app.isInternational === undefined) {
      next = 'International student? (yes/no)';
    } else if (app.isInternational === true && !app.testScores?.toefl && !app.testScores?.ielts) {
      next = 'TOEFL or IELTS score?';
    } else if (app.personalStatement === undefined) {
      next = 'Personal statement? (yes/no)';
    } else if (app.recommendationLetter === undefined) {
      next = 'Recommendation letter? (yes/no)';
    }

    console.log('NEXT QUESTION:', next);

    if (next) {
      await ApplicantService.addMessageToTranscript(sessionId, 'assistant', next);
      return res.json({ success: true, data: { message: next, completed: false } });
    }

    // --- Evaluation guard (fixes TS18048) ---
    if (app.gpa === undefined) {
      // This should not happen, but keeps TS + runtime safe.
      return res.status(400).json({
        success: false,
        message: 'Missing GPA. Please provide GPA before evaluation.',
      });
    }

    const minGPA = app.program === 'Computer Science' ? 3.3 : 3.0;
    const ok =
      app.gpa >= minGPA &&
      !!app.highSchoolDiploma &&
      !!app.personalStatement &&
      !!app.recommendationLetter;

    const outcome = ok ? 'Meets Criteria' : 'Criteria Not Met';

    await ApplicantService.completeEvaluation(sessionId, outcome, 'Evaluated', app.createdAt);

    const closing = ok ? 'Congratulations! You meet all criteria.' : 'You do not meet criteria.';
    await ApplicantService.addMessageToTranscript(sessionId, 'assistant', closing);

    return res.json({ success: true, data: { message: closing, completed: true, outcome } });
  };

  getChatHistory = async (req: Request, res: Response) => {
    const app = await ApplicantService.getApplicantBySessionId(req.params.sessionId);
    if (!app) {
      return res.status(404).json({ success: false });
    }

    return res.json({ success: true, data: { messages: app.transcript } });
  };
}

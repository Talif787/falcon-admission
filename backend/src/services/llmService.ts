// backend/src/services/llmService.ts
// OpenAI Version - Best Accuracy

import OpenAI from 'openai';
import { logger } from '../utils/logger';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface EligibilityResult {
  outcome: 'Meets Criteria' | 'Criteria Not Met';
  ruleSummary: string;
  reasoning: string;
  extractedData: {
    gpa?: number;
    age?: number;
    testScores?: Record<string, number>;
    workExperience?: number;
    program?: string;
  };
}

export class LLMService {
  private openai: OpenAI;
  private model: string = 'gpt-4o'; // Most accurate and cost-effective

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    logger.info('LLMService initialized with OpenAI GPT-4o');
  }

  /**
   * Generate chat response with conversation history
   */
  async generateChatResponse(
    userMessage: string,
    conversationHistory: ChatMessage[],
    context?: string
  ): Promise<string> {
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      // Add system context
      if (context) {
        messages.push({
          role: 'system',
          content: `You are a professional university admission officer chatbot. Use this context:\n\n${context}`
        });
      }

      // Add conversation history
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role === 'system' ? 'system' : msg.role,
          content: msg.content
        });
      });

      // Add current message
      messages.push({
        role: 'user',
        content: userMessage
      });

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content || '';
      logger.info('Generated chat response with OpenAI');
      return response;
    } catch (error) {
      logger.error('Error generating chat response:', error);
      throw error;
    }
  }

  /**
   * Generate initial greeting
   */
  async generateGreeting(programRequirements: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a warm, professional university admission officer chatbot.'
          },
          {
            role: 'user',
            content: `Generate a brief, friendly greeting for prospective students.

REQUIREMENTS OVERVIEW:
${programRequirements.substring(0, 500)}

The greeting should:
1. Welcome them warmly
2. Explain you'll help assess their eligibility
3. Ask which program they're interested in (Business or Computer Science)

Keep it to 2-3 sentences, friendly but professional.`
          }
        ],
        temperature: 0.8,
        max_tokens: 150,
      });

      return completion.choices[0]?.message?.content || 
        "Hello! Welcome to Falcon University. I'm here to help assess your eligibility for admission. Which program are you interested in - Business or Computer Science?";
    } catch (error) {
      logger.error('Error generating greeting:', error);
      return "Hello! Welcome to Falcon University. I'm here to help assess your eligibility for admission. Which program are you interested in - Business or Computer Science?";
    }
  }

  /**
   * Generate next question
   */
  async generateNextQuestion(
    program: string,
    programRequirements: string,
    conversationHistory: ChatMessage[],
    collectedData: Record<string, any>
  ): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are collecting admission information for ${program} program. Ask ONE clear, specific question at a time. Never ask about data already collected.`
          },
          {
            role: 'user',
            content: `PROGRAM: ${program}

REQUIREMENTS:
${programRequirements.substring(0, 800)}

RECENT CONVERSATION:
${conversationHistory.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}

DATA ALREADY COLLECTED (DO NOT ASK ABOUT):
${JSON.stringify(collectedData, null, 2)}

Generate the next question to collect missing information. Ask ONE question only, be specific and clear.`
          }
        ],
        temperature: 0.5,
        max_tokens: 100,
      });

      return completion.choices[0]?.message?.content?.trim() || 
        "Could you tell me more about your qualifications?";
    } catch (error) {
      logger.error('Error generating next question:', error);
      throw error;
    }
  }

  /**
   * Evaluate student eligibility - Most accurate with GPT-4o
   */
  async evaluateEligibility(
    program: string,
    programRequirements: string,
    collectedData: Record<string, any>,
    conversationTranscript: string
  ): Promise<EligibilityResult> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an admission evaluator. Strictly evaluate against the stated requirements. Return ONLY valid JSON, no markdown formatting.`
          },
          {
            role: 'user',
            content: `Evaluate this student's eligibility for ${program} program.

PROGRAM REQUIREMENTS:
${programRequirements}

STUDENT DATA:
Name: ${collectedData.name}
GPA: ${collectedData.gpa}
Age: ${collectedData.age}
Test Scores: ${JSON.stringify(collectedData.testScores)}
Work Experience: ${collectedData.workExperience}

CONVERSATION TRANSCRIPT:
${conversationTranscript.substring(0, 1000)}

Evaluate strictly against the requirements. Return ONLY this JSON structure:
{
  "outcome": "Meets Criteria" or "Criteria Not Met",
  "ruleSummary": "One sentence explaining why",
  "reasoning": "Detailed explanation comparing student data to requirements",
  "extractedData": {
    "gpa": ${collectedData.gpa},
    "age": ${collectedData.age},
    "testScores": ${JSON.stringify(collectedData.testScores)},
    "workExperience": ${collectedData.workExperience},
    "program": "${program}"
  }
}

Example for Computer Science:
If requirements say GPA ≥ 3.3 and SAT ≥ 1300:
- Student has GPA 3.9 and SAT 1450 → "Meets Criteria"
- Student has GPA 3.2 and SAT 1250 → "Criteria Not Met"`
          }
        ],
        temperature: 0.2, // Low temperature for consistency
        max_tokens: 600,
        response_format: { type: "json_object" } // Force JSON response
      });

      const text = completion.choices[0]?.message?.content || '{}';
      const evaluation = JSON.parse(text);
      
      logger.info('OpenAI evaluation completed', { outcome: evaluation.outcome });
      return evaluation;
    } catch (error) {
      logger.error('Error evaluating eligibility:', error);
      throw error;
    }
  }

  /**
   * Generate closing message
   */
  async generateClosingMessage(
    outcome: 'Meets Criteria' | 'Criteria Not Met',
    ruleSummary: string
  ): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are delivering admission results warmly and professionally.'
          },
          {
            role: 'user',
            content: `Generate a warm closing message.

OUTCOME: ${outcome}
REASON: ${ruleSummary}

The message should:
- ${outcome === 'Meets Criteria' ? 'Congratulate warmly and mention next steps in application process' : 'Be encouraging, suggest improvement areas, invite to reapply'}
- Be 2-3 sentences
- Be empathetic and supportive
- End positively

Respond with ONLY the message.`
          }
        ],
        temperature: 0.8,
        max_tokens: 150,
      });

      return completion.choices[0]?.message?.content?.trim() || 
        (outcome === 'Meets Criteria'
          ? "Congratulations! You meet the admission criteria. Our admissions team will review your complete application."
          : "Thank you for your interest. While you don't meet all criteria currently, we encourage you to strengthen your application and reapply.");
    } catch (error) {
      logger.error('Error generating closing message:', error);
      
      if (outcome === 'Meets Criteria') {
        return "Congratulations! Based on your qualifications, you meet the criteria to proceed with your application. Our admissions team will review your complete application and be in touch soon.";
      } else {
        return "Thank you for your interest in Falcon University. While you don't currently meet all the admission criteria, we encourage you to work on the areas mentioned and consider reapplying in the future.";
      }
    }
  }
}
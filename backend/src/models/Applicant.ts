// backend/src/models/Applicant.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface IApplicant extends Document {
  studentName: string;
  program: 'Business' | 'Computer Science';
  outcome: 'Meets Criteria' | 'Criteria Not Met' | 'In Progress';
  ruleSummary: string;
  transcript: IMessage[];
  sessionId: string;

  // Quantitative fields
  gpa?: number;
  age?: number;
  testScores?: {
    sat?: number;
    act?: number;
    gre?: number;
    gmat?: number;
    toefl?: number;
    ielts?: number;
    duolingo?: number;
  };
  workExperience?: number;

  // Boolean/Qualitative fields
  highSchoolDiploma?: boolean;
  mathCourses?: boolean;
  isInternational?: boolean;
  personalStatement?: boolean;
  recommendationLetter?: boolean;

  extracurriculars?: string[];
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    interviewDuration?: number;
    completedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;

  addMessage(role: IMessage['role'], content: string): Promise<IApplicant>;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ApplicantSchema = new Schema<IApplicant>(
  {
    studentName: {
      type: String,
      required: true,
      default: 'Anonymous',
      trim: true,
      maxlength: 100
    },
    program: {
      type: String,
      enum: ['Business', 'Computer Science'],
      required: true
    },
    outcome: {
      type: String,
      enum: ['Meets Criteria', 'Criteria Not Met', 'In Progress'],
      default: 'In Progress',
      required: true
    },
    ruleSummary: {
      type: String,
      default: '',
      maxlength: 500
    },
    transcript: {
      type: [MessageSchema],
      default: []
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    gpa: {
      type: Number,
      min: 0.0,
      max: 4.0
    },
    age: {
      type: Number,
      min: 10,
      max: 100
    },
    testScores: {
      sat: { type: Number, min: 400, max: 1600 },
      act: { type: Number, min: 1, max: 36 },
      gre: { type: Number, min: 260, max: 340 },
      gmat: { type: Number, min: 200, max: 800 },
      toefl: { type: Number, min: 0, max: 120 },
      ielts: { type: Number, min: 0, max: 9 },
      duolingo: { type: Number, min: 0, max: 160 }
    },
    workExperience: {
      type: Number,
      min: 0,
      max: 50
    },
    highSchoolDiploma: {
      type: Boolean,
      default: undefined  // CRITICAL: No default, must be explicitly set
    },
    mathCourses: {
      type: Boolean,
      default: undefined  // CRITICAL: No default
    },
    isInternational: {
      type: Boolean,
      default: undefined  // CRITICAL: No default - this was the bug!
    },
    personalStatement: {
      type: Boolean,
      default: undefined  // CRITICAL: No default
    },
    recommendationLetter: {
      type: Boolean,
      default: undefined  // CRITICAL: No default
    },
    extracurriculars: [{
      type: String,
      trim: true
    }],
    metadata: {
      ipAddress: String,
      userAgent: String,
      interviewDuration: Number,
      completedAt: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for efficient querying
ApplicantSchema.index({ createdAt: -1 });
ApplicantSchema.index({ program: 1, outcome: 1 });
ApplicantSchema.index({ outcome: 1 });

// Virtual for interview duration in minutes
ApplicantSchema.virtual('interviewDurationMinutes').get(function () {
  if (this.metadata.interviewDuration) {
    return Math.round(this.metadata.interviewDuration / 60000);
  }
  return 0;
});

// Instance method to add message to transcript
ApplicantSchema.methods.addMessage = function (role: 'user' | 'assistant' | 'system', content: string) {
  this.transcript.push({
    role,
    content,
    timestamp: new Date()
  });
  return this.save();
};

// Static method to get statistics
ApplicantSchema.statics.getStatistics = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        eligible: {
          $sum: { $cond: [{ $eq: ['$outcome', 'Meets Criteria'] }, 1, 0] }
        },
        notEligible: {
          $sum: { $cond: [{ $eq: ['$outcome', 'Criteria Not Met'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$outcome', 'In Progress'] }, 1, 0] }
        },
        businessApplicants: {
          $sum: { $cond: [{ $eq: ['$program', 'Business'] }, 1, 0] }
        },
        csApplicants: {
          $sum: { $cond: [{ $eq: ['$program', 'Computer Science'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    eligible: 0,
    notEligible: 0,
    inProgress: 0,
    businessApplicants: 0,
    csApplicants: 0
  };
};

export default mongoose.model<IApplicant>('Applicant', ApplicantSchema);
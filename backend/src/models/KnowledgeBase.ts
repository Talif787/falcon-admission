// backend/src/models/KnowledgeBase.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeBase extends Document {
  filename: string;
  originalName: string;
  fileSize: number;
  uploadedAt: Date;
  parsedText: string;
  embeddings?: Array<{
    text: string;
    embedding: number[];
    metadata?: Record<string, any>;
  }>;
  metadata: {
    pageCount?: number;
    wordCount?: number;
    sections?: Array<{
      title: string;
      content: string;
    }>;
    requirements?: Array<{
      program: string;
      criteria: Record<string, any>;
    }>;
  };
  isActive: boolean;
  version: number;
}

const KnowledgeBaseSchema = new Schema<IKnowledgeBase>(
  {
    filename: {
      type: String,
      required: true,
      unique: true
    },
    originalName: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    parsedText: {
      type: String,
      required: true
    },
    embeddings: [{
      text: String,
      embedding: [Number],
      metadata: Schema.Types.Mixed
    }],
    metadata: {
      pageCount: Number,
      wordCount: Number,
      sections: [{
        title: String,
        content: String
      }],
      requirements: [{
        program: String,
        criteria: Schema.Types.Mixed
      }]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    version: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient active knowledge base retrieval
KnowledgeBaseSchema.index({ isActive: 1, version: -1 });

// Static method to get active knowledge base
KnowledgeBaseSchema.statics.getActiveKnowledgeBase = async function() {
  return this.findOne({ isActive: true }).sort({ version: -1 });
};

// Static method to deactivate all previous versions
KnowledgeBaseSchema.statics.deactivatePrevious = async function() {
  return this.updateMany({ isActive: true }, { isActive: false });
};

export default mongoose.model<IKnowledgeBase>('KnowledgeBase', KnowledgeBaseSchema);
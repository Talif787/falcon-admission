// backend/src/services/embeddingService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

export interface EmbeddingResult {
  text: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

export class EmbeddingService {
  private genAI: GoogleGenerativeAI;
  private embeddingModel: string = 'text-embedding-004';

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Create embeddings for text chunks using Gemini
   */
  async createEmbeddings(textChunks: string[]): Promise<EmbeddingResult[]> {
    try {
      const results: EmbeddingResult[] = [];
      const model = this.genAI.getGenerativeModel({ model: this.embeddingModel });

      // Process in batches to avoid rate limits (Gemini: 15 req/min)
      const batchSize = 10;
      for (let i = 0; i < textChunks.length; i += batchSize) {
        const batch = textChunks.slice(i, i + batchSize);
        
        // Process each text in batch
        for (let j = 0; j < batch.length; j++) {
          const text = batch[j];
          
          try {
            const result = await model.embedContent(text);
            const embedding = result.embedding;

            results.push({
              text,
              embedding: embedding.values,
              metadata: { index: i + j }
            });

            logger.info(`Created embedding ${i + j + 1}/${textChunks.length}`);
          } catch (error: any) {
            logger.error(`Error embedding chunk ${i + j}:`, error.message);
            // Continue with other chunks even if one fails
          }
        }

        // Add delay between batches to respect rate limits
        if (i + batchSize < textChunks.length) {
          await this.delay(4000); // 4 second delay between batches
        }
      }

      logger.info(`Successfully created ${results.length} embeddings`);
      return results;
    } catch (error) {
      logger.error('Error creating embeddings:', error);
      throw new Error(`Failed to create embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Split text into chunks for embedding
   */
  splitTextIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= chunkSize) {
        currentChunk += sentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        
        // Add overlap from previous chunk
        const words = currentChunk.split(' ');
        const overlapWords = words.slice(-Math.floor(overlap / 5)).join(' ');
        currentChunk = overlapWords + sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks.filter(chunk => chunk.length > 50);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Find most relevant chunks based on query
   */
  async findRelevantChunks(
    query: string,
    embeddings: EmbeddingResult[],
    topK: number = 5
  ): Promise<EmbeddingResult[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.embeddingModel });
      const result = await model.embedContent(query);
      const queryEmbedding = result.embedding.values;

      const scored = embeddings.map(item => ({
        ...item,
        score: this.cosineSimilarity(queryEmbedding, item.embedding)
      }));

      scored.sort((a, b) => b.score - a.score);

      return scored.slice(0, topK);
    } catch (error) {
      logger.error('Error finding relevant chunks:', error);
      throw error;
    }
  }

  /**
   * Delay helper for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
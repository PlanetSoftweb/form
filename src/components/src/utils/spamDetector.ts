import * as tf from '@tensorflow/tfjs';
import * as EmailValidator from 'email-validator';

export interface SpamAnalysis {
  isSpam: boolean;
  confidence: number;
  reasons: string[];
}

export class SpamDetector {
  private static instance: SpamDetector;
  private model: tf.LayersModel | null = null;

  private constructor() {}

  static getInstance(): SpamDetector {
    if (!SpamDetector.instance) {
      SpamDetector.instance = new SpamDetector();
    }
    return SpamDetector.instance;
  }

  async analyzeSubmission(submission: Record<string, any>): Promise<SpamAnalysis> {
    const reasons: string[] = [];
    let spamScore = 0;

    // Check for invalid email format
    const emailFields = Object.entries(submission)
      .filter(([key, value]) => 
        key.toLowerCase().includes('email') && typeof value === 'string'
      );

    for (const [key, value] of emailFields) {
      if (!EmailValidator.validate(value)) {
        reasons.push(`Invalid email format: ${key}`);
        spamScore += 0.3;
      }
    }

    // Check for suspicious patterns
    const textFields = Object.entries(submission)
      .filter(([_, value]) => typeof value === 'string');

    for (const [key, value] of textFields) {
      // Check for excessive capitalization
      const upperCaseRatio = (value.match(/[A-Z]/g) || []).length / value.length;
      if (upperCaseRatio > 0.7) {
        reasons.push(`Excessive capitalization in ${key}`);
        spamScore += 0.2;
      }

      // Check for repetitive characters
      if (/(.)\1{4,}/.test(value)) {
        reasons.push(`Repetitive characters in ${key}`);
        spamScore += 0.2;
      }

      // Check for common spam keywords
      const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'prize', 'free money'];
      const containsSpamKeywords = spamKeywords.some(keyword => 
        value.toLowerCase().includes(keyword)
      );
      if (containsSpamKeywords) {
        reasons.push(`Spam keywords detected in ${key}`);
        spamScore += 0.4;
      }

      // Check for URLs in unexpected fields
      if (!key.toLowerCase().includes('website') && /http[s]?:\/\//.test(value)) {
        reasons.push(`Unexpected URL in ${key}`);
        spamScore += 0.3;
      }
    }

    const isSpam = spamScore >= 0.5;
    const confidence = Math.min(spamScore, 1);

    return {
      isSpam,
      confidence: parseFloat(confidence.toFixed(2)),
      reasons
    };
  }
}
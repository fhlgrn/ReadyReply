import { GoogleGenerativeAI } from '@google/generative-ai';
import { storage } from './storage';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private connected: boolean = false;
  private model: string = 'gemini-1.5-pro';

  constructor() {
    // Try to initialize using environment variable if available
    if (process.env.GEMINI_API_KEY) {
      this.initialize(process.env.GEMINI_API_KEY);
    } else {
      console.log('Gemini API key not found in environment variables');
    }
  }

  async initialize(apiKey: string): Promise<boolean> {
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Test the connection with a simple prompt
      const generationConfig = {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      };
      
      const model = this.genAI.getGenerativeModel({ model: this.model, generationConfig });
      
      // Send a simple test prompt to verify connection
      const result = await model.generateContent("Say hello");
      const response = await result.response;
      
      console.log('Gemini connection successfully established');
      this.connected = true;
      return true;
    } catch (error) {
      console.error('Error initializing Gemini connection:', error);
      this.connected = false;
      return false;
    }
  }

  async updateApiKey(apiKey: string): Promise<boolean> {
    return this.initialize(apiKey);
  }

  async generateDraftReply(email: any, template: string): Promise<string> {
    if (!this.genAI || !this.connected) {
      throw new Error('Gemini service not connected or initialized');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      // Get the settings for word limit
      const settings = await storage.getAppSettings();
      const maxWords = settings.maxResponseWords || 75;
      
      // Create a system prompt
      const prompt = `
      You are tasked with creating a concise draft email reply.
      Analyze the incoming email details and create a personalized response that addresses the sender's concerns.
      
      Incoming Email:
      From: ${email.from}
      Subject: ${email.subject}
      Body: ${email.body}
      
      Draft a personalized email response that:
      1. Is professionally written with a friendly tone
      2. Addresses the specific points in the email
      3. Is concise, using NO MORE THAN ${maxWords} WORDS
      4. Ends with an appropriate sign-off
      5. Is a complete, ready-to-send response
      
      Reply as if you are the recipient, without mentioning that you're an AI.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error: any) {
      console.error('Error generating email draft with Gemini:', error);
      throw new Error(`Failed to generate draft reply: ${error.message || 'Unknown error'}`);
    }
  }

  setModel(model: string) {
    this.model = model;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export const geminiService = new GeminiService();
import { GoogleGenerativeAI } from '@google/generative-ai';

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
      
      // Create a system prompt from the template
      const prompt = `
      You are tasked with creating a draft email reply based on the template below.
      Analyze the incoming email details and create a personalized response that addresses the sender's concerns.
      
      Incoming Email:
      From: ${email.from}
      Subject: ${email.subject}
      Body: ${email.body}
      
      Response Template:
      ${template}
      
      Draft a personalized email response following the style and structure of the template, but adapted to address the specific content of the incoming email.
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
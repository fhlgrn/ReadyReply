import Anthropic from '@anthropic-ai/sdk';
import { storage } from './storage';

// Class to handle all Claude API interactions
export class ClaudeService {
  private anthropic: Anthropic;
  private connected: boolean = false;
  
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  }
  
  // Initialize the connection
  async initialize(): Promise<boolean> {
    try {
      const token = await storage.getAuthToken('claude');
      
      // If we have a stored token, use it
      if (token) {
        this.anthropic = new Anthropic({
          apiKey: token.accessToken,
        });
      }
      
      // Check connection by making a simple request
      const response = await this.anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say "OK" if you can hear me' }],
      });
      
      this.connected = true;
      return true;
    } catch (error) {
      console.error('Error initializing Claude connection:', error);
      this.connected = false;
      return false;
    }
  }
  
  // Update the API key
  async updateApiKey(apiKey: string): Promise<boolean> {
    try {
      this.anthropic = new Anthropic({
        apiKey: apiKey,
      });
      
      // Test the connection
      const response = await this.anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say "OK" if you can hear me' }],
      });
      
      // If we get here, the key is valid - save it
      await storage.saveAuthToken({
        provider: 'claude',
        accessToken: apiKey,
        refreshToken: undefined,
        expiresAt: undefined
      });
      
      this.connected = true;
      return true;
    } catch (error) {
      console.error('Error updating Claude API key:', error);
      this.connected = false;
      return false;
    }
  }
  
  // Generate a draft reply to an email
  async generateDraftReply(email: any, template: string): Promise<string> {
    try {
      if (!this.connected) {
        await this.initialize();
      }
      
      // Get the current model and word limit from settings
      const settings = await storage.getAppSettings();
      const maxWords = settings.maxResponseWords || 75;
      
      // Prepare the prompt for Claude
      const prompt = `
        You are an email assistant that drafts professional responses to emails.
        
        Here's the email I received:
        From: ${email.from}
        Subject: ${email.subject}
        
        ${email.body}
        
        Please write a draft reply that:
        1. Is professionally written and maintains a friendly tone
        2. Addresses the specific points raised in the original email
        3. Is concise but complete, with NO MORE THAN ${maxWords} WORDS
        4. Ends with an appropriate sign-off
        5. Is a complete, ready-to-send response
        
        Reply as if you are me, without mentioning that you're an AI.
      `;
      
      const response = await this.anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      
      // Process the response and extract text from the content block
      let responseText = "";
      if (response.content && response.content.length > 0) {
        const contentBlock = response.content[0];
        // Check if it's a TextBlock (which has a text property)
        if (contentBlock.type === 'text') {
          responseText = contentBlock.text;
        }
      }
      return responseText;
    } catch (error) {
      console.error('Error generating draft reply:', error);
      throw error;
    }
  }
  
  // Check connection status
  isConnected(): boolean {
    return this.connected;
  }
}

// Export a singleton instance
export const claudeService = new ClaudeService();

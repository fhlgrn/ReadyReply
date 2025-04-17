import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { storage } from './storage';

// Gmail API scopes needed for the application
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',  // Read emails
  'https://www.googleapis.com/auth/gmail.compose',   // Create drafts
  'https://www.googleapis.com/auth/gmail.labels',    // Manage labels
];

// Class to handle all Gmail API interactions
export class GmailService {
  private oauth2Client: OAuth2Client;
  private gmail: any;

  constructor() {
    console.log("Initializing Gmail Service with credentials:", {
      clientId: process.env.GMAIL_CLIENT_ID ? "Present" : "Missing",
      clientSecret: process.env.GMAIL_CLIENT_SECRET ? "Present" : "Missing",
      redirectUri: process.env.GMAIL_REDIRECT_URI ? process.env.GMAIL_REDIRECT_URI : "Missing"
    });

    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  // Set credentials from stored tokens
  async setCredentials(): Promise<boolean> {
    try {
      const token = await storage.getAuthToken('gmail');
      if (!token) return false;

      this.oauth2Client.setCredentials({
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
        expiry_date: token.expiresAt ? token.expiresAt.getTime() : undefined
      });

      // Check if token is about to expire and refresh if needed
      if (token.expiresAt && token.expiresAt.getTime() < Date.now() + 60000) {
        const { credentials } = await this.oauth2Client.refreshAccessToken();
        await this.saveTokens(credentials);
      }

      return true;
    } catch (error) {
      console.error('Error setting Gmail credentials:', error);
      return false;
    }
  }

  // Generate authentication URL for user to authorize the app
  getAuthUrl(): string {
    console.log("Generating Gmail Auth URL with scopes:", SCOPES);
    console.log("Redirect URI configured as:", process.env.GMAIL_REDIRECT_URI);

    // For now we'll continue using the configured redirect URI but
    // we've added a manual code entry option in the UI to help users connect
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent', // Force to show the consent screen
      // Add detailed instructions in the URL to make it clear what to do
      state: 'copy-code-to-ready-reply-app'
    });

    console.log("Full generated Auth URL:", url);
    return url;
  }

  // Handle the authorization code from oauth callback
  async handleAuthCode(code: string): Promise<boolean> {
    try {
      console.log("Handling auth code:", code.substring(0, 10) + "...");

      const { tokens } = await this.oauth2Client.getToken(code);
      console.log("Received tokens:", {
        access_token: tokens.access_token ? "Present (length: " + tokens.access_token.length + ")" : "Missing",
        refresh_token: tokens.refresh_token ? "Present" : "Missing",
        expiry_date: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : "Missing"
      });

      await this.saveTokens(tokens);
      return true;
    } catch (error) {
      console.error('Error getting tokens from auth code:', error);
      return false;
    }
  }

  // Save tokens to storage
  private async saveTokens(tokens: any): Promise<void> {
    await storage.saveAuthToken({
      provider: 'gmail',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || (await storage.getAuthToken('gmail'))?.refreshToken,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined
    });
  }

  // Get emails matching filter criteria
  async getFilteredEmails(filter: any): Promise<any[]> {
    try {
      if (!await this.setCredentials()) {
        throw new Error('Not authenticated with Gmail');
      }

      // Build Gmail query string
      let query = '';

      if (filter.fromEmail) {
        query += `from:(${filter.fromEmail}) `;
      }

      if (filter.subjectContains) {
        const subjects = filter.subjectContains.split(',').map((s: string) => s.trim());
        const subjectQuery = subjects.map((s: string) => `subject:(${s})`).join(' OR ');
        query += `(${subjectQuery}) `;
      }

      if (filter.hasNoLabel) {
        query += `-label:${filter.hasNoLabel} `;
      }

      // Only get unread messages by default
      query += 'is:unread ';

      // Get list of message IDs matching query
      const res = await this.gmail.users.messages.list({
        userId: 'me',
        q: query.trim(),
        maxResults: 10 // Limit results to avoid hitting rate limits
      });

      if (!res.data.messages || res.data.messages.length === 0) {
        return [];
      }

      // Fetch full message details for each message ID
      const emails = await Promise.all(
        res.data.messages.map(async (message: any) => {
          const msg = await this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full'
          });

          // Check if this email has already been processed
          const existingLog = await storage.getLogByEmailId(message.id);
          if (existingLog) {
            return null; // Skip already processed emails
          }

          // Extract headers
          const headers = msg.data.payload.headers;
          const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
          const from = headers.find((h: any) => h.name === 'From')?.value || '';

          // Extract body
          let body = '';
          if (msg.data.payload.parts && msg.data.payload.parts.length > 0) {
            // Get the plain text part if available
            const textPart = msg.data.payload.parts.find((part: any) => part.mimeType === 'text/plain');
            if (textPart && textPart.body.data) {
              body = Buffer.from(textPart.body.data, 'base64').toString();
            }
          } else if (msg.data.payload.body && msg.data.payload.body.data) {
            body = Buffer.from(msg.data.payload.body.data, 'base64').toString();
          }

          // If body contains filter terms, include it
          if (filter.bodyContains) {
            const bodyTerms = filter.bodyContains.split(',').map((term: string) => term.trim().toLowerCase());
            const bodyLower = body.toLowerCase();
            const matches = bodyTerms.some((term: string) => bodyLower.includes(term));

            if (!matches) {
              return null; // Skip if body doesn't match filter terms
            }
          }

          return {
            id: message.id,
            threadId: message.threadId,
            subject,
            from,
            body
          };
        })
      );

      // Filter out null results (already processed emails)
      return emails.filter(email => email !== null);
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  // Create a draft reply for a given email
  async createDraft(email: any, replyText: string): Promise<string> {
    try {
      if (!await this.setCredentials()) {
        throw new Error('Not authenticated with Gmail');
      }

      // Extract recipient from the From header
      const recipient = email.from.match(/<(.+)>/) ? 
        email.from.match(/<(.+)>/)[1] : 
        email.from;

      // Create a reply
      const messageSubject = email.subject.startsWith('Re:') ? 
        email.subject : 
        `Re: ${email.subject}`;

      // Build the email content
      const messageParts = [
        `To: ${email.from}`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${messageSubject}`,
        `In-Reply-To: ${email.id}`,
        `References: ${email.id}`,
        '',
        replyText,
        ''
      ];

      const message = messageParts.join('\n');

      // Create the draft
      const res = await this.gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
          message: {
            threadId: email.threadId,
            raw: Buffer.from(message).toString('base64url')
          }
        }
      });

      return res.data.id;
    } catch (error) {
      console.error('Error creating draft:', error);
      throw error;
    }
  }

  // Check API connection status
  async checkConnection(): Promise<{connected: boolean, email?: string}> {
    try {
      if (!await this.setCredentials()) {
        return { connected: false };
      }

      const profile = await this.gmail.users.getProfile({
        userId: 'me'
      });

      return { 
        connected: true,
        email: profile.data.emailAddress
      };
    } catch (error) {
      console.error('Error checking Gmail connection:', error);
      return { connected: false };
    }
  }
}

// Export a singleton instance
export const gmailService = new GmailService();
console.log('Testing Gmail Auth Process in Server Logs')
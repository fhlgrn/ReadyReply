
# ReadyReply - AI-Powered Email Response Automation

ReadyReply is a web application that automates email responses using Gmail API and Google's Gemini AI. It helps you manage your inbox by automatically generating draft responses based on customizable filters and templates.

## Features

- 📧 Gmail Integration: Seamlessly connects with your Gmail account
- 🤖 AI-Powered Responses: Uses Gemini AI to generate contextual email replies
- 📝 Custom Filters: Create and manage email filters with specific criteria
- ✨ Response Templates: Customize AI response templates for different types of emails
- 📊 Dashboard: Monitor email processing statistics and system status
- 📝 Draft Mode: All responses are saved as drafts for review before sending

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Express.js + TypeScript
- UI: Tailwind CSS + Radix UI Components
- Database: PostgreSQL with Drizzle ORM
- AI: Google Gemini AI
- Authentication: Gmail OAuth 2.0

## Getting Started

1. Create a new Repl using this template
2. Set up required environment variables in Replit Secrets:
   - `GMAIL_CLIENT_ID`
   - `GMAIL_CLIENT_SECRET`
   - `GMAIL_REDIRECT_URI`
   - `GEMINI_API_KEY`
3. Follow the Setup Guide in the application to configure:
   - Gmail API Integration
   - Gemini AI Access
4. Create email filters and customize response templates
5. Enable the service and monitor responses in your Gmail drafts

## Usage

1. Navigate to the Filters page to create new email filters
2. Customize response templates for each filter
3. Use the Dashboard to monitor email processing
4. Check Gmail drafts folder for AI-generated responses
5. Review and send responses manually

## Development

The application uses the following commands:
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run check`: Type checking
- `npm run db:push`: Update database schema

## License

MIT License


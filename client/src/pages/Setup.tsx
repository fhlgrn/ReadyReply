import React from 'react';

export default function Setup() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        ReadyReply Setup Guide
      </h1>
      
      <div className="prose prose-lg max-w-none">
        <h2>Setting up Google Cloud for Gmail Integration</h2>
        <p>
          To use ReadyReply with your Gmail account, you need to set up a Google Cloud project
          and configure OAuth credentials. Follow these steps carefully:
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold mb-4">Step 1: Create a Google Cloud Project</h3>
          <ol className="list-decimal pl-6 space-y-3">
            <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
            <li>Click on the project dropdown at the top of the page</li>
            <li>Click "New Project"</li>
            <li>Enter a name for your project (e.g. "ReadyReply")</li>
            <li>Click "Create"</li>
            <li>Wait for the project to be created, then select it from the projects list</li>
          </ol>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold mb-4">Step 2: Enable the Gmail API</h3>
          <ol className="list-decimal pl-6 space-y-3">
            <li>In your Google Cloud project, go to "APIs & Services" > "Library"</li>
            <li>Search for "Gmail API" and click on it</li>
            <li>Click "Enable"</li>
          </ol>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold mb-4">Step 3: Configure the OAuth Consent Screen</h3>
          <ol className="list-decimal pl-6 space-y-3">
            <li>Go to "APIs & Services" > "OAuth consent screen"</li>
            <li>Select "External" as the user type and click "Create"</li>
            <li>Fill in the required information:
              <ul className="list-disc pl-6 mt-2">
                <li>App name: "ReadyReply"</li>
                <li>User support email: Your email address</li>
                <li>Developer contact information: Your email address</li>
              </ul>
            </li>
            <li>Click "Save and Continue"</li>
            <li>On the "Scopes" screen, click "Add or Remove Scopes"</li>
            <li>Add the following scopes:
              <ul className="list-disc pl-6 mt-2 font-mono text-sm">
                <li>https://www.googleapis.com/auth/gmail.readonly</li>
                <li>https://www.googleapis.com/auth/gmail.compose</li>
                <li>https://www.googleapis.com/auth/gmail.labels</li>
              </ul>
            </li>
            <li>Click "Save and Continue"</li>
            <li>On the "Test users" screen, click "Add Users"</li>
            <li>Add your Gmail address as a test user</li>
            <li>Click "Save and Continue"</li>
            <li>Review the summary and click "Back to Dashboard"</li>
          </ol>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold mb-4">Step 4: Create OAuth Credentials</h3>
          <ol className="list-decimal pl-6 space-y-3">
            <li>Go to "APIs & Services" > "Credentials"</li>
            <li>Click "Create Credentials" > "OAuth client ID"</li>
            <li>Select "Web application" as the application type</li>
            <li>Name: "ReadyReply Web Client"</li>
            <li>Under "Authorized JavaScript origins", add:
              <div className="bg-gray-100 p-2 rounded font-mono text-sm mt-2">
                https://[your-replit-domain].replit.app
              </div>
            </li>
            <li>Under "Authorized redirect URIs", add the following URLs:
              <div className="bg-gray-100 p-2 rounded font-mono text-sm mt-2">
                http://fhlgrn.com/<br />
                https://[your-replit-domain].replit.app/oauth-redirect.html<br />
                https://[your-replit-domain].replit.app
              </div>
            </li>
            <li>Click "Create"</li>
            <li>A popup will appear with your credentials. Take note of the "Client ID" and "Client Secret"</li>
          </ol>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold mb-4">Step 5: Update Environment Variables</h3>
          <p>For security reasons, you'll need to update the environment variables in your Replit project:</p>
          <ol className="list-decimal pl-6 space-y-3">
            <li>In your Replit project, click on the lock icon in the sidebar to access Secrets</li>
            <li>Add the following secrets:
              <ul className="list-disc pl-6 mt-2">
                <li><code>GMAIL_CLIENT_ID</code>: Your Client ID from step 4</li>
                <li><code>GMAIL_CLIENT_SECRET</code>: Your Client Secret from step 4</li>
                <li><code>GMAIL_REDIRECT_URI</code>: <code>http://fhlgrn.com/</code> (this is the current redirect URL configuration)</li>
              </ul>
            </li>
            <li>Click "Save" for each secret</li>
            <li>Restart your Replit application</li>
          </ol>
        </div>
        
        <h2>Using ReadyReply with Gmail</h2>
        <p>
          After completing the setup, you can now connect ReadyReply to your Gmail account:
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold mb-4">Connecting Your Gmail Account</h3>
          <ol className="list-decimal pl-6 space-y-3">
            <li>In ReadyReply, go to the Dashboard</li>
            <li>In the Gmail API Configuration card, click "Reconnect"</li>
            <li>A new window will open with Google's authorization page</li>
            <li>Select your Google account and grant the requested permissions</li>
            <li>After approval, you'll be redirected to a page with an authorization code</li>
            <li>Copy this code and paste it into the dialog that appears in ReadyReply</li>
            <li>Click "Connect" to complete the authorization</li>
          </ol>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Troubleshooting</h3>
          <p className="text-blue-700">
            If you encounter issues during setup:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-blue-700">
            <li>Make sure all the required scopes are added to your OAuth consent screen</li>
            <li>Verify that your redirect URIs are correctly configured</li>
            <li>Check that your environment variables match the OAuth credentials</li>
            <li>If you get an "invalid_grant" error, try recreating the OAuth credentials</li>
            <li>Ensure your Google account is added as a test user in your OAuth consent screen</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
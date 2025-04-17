import React from 'react';
import gmailLogo from '../assets/gmail_logo.png';
import geminiLogo from '../assets/Google_Gemini_logo.png';

export default function Setup() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ReadyReply Setup Guide
      </h1>
      
      <div className="bg-white p-4 shadow-sm rounded-lg mb-8">
        <p className="text-center text-gray-700">
          This guide will help you set up both Gmail and Google Gemini AI integrations for ReadyReply
        </p>
      </div>
      
      <div className="grid md:grid-cols-12 gap-8">
        {/* Table of Contents Sidebar */}
        <div className="md:col-span-3">
          <div className="sticky top-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-lg mb-3 border-b pb-2">Quick Navigation</h3>
              <nav>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#gmail-setup" className="text-blue-600 hover:underline">Gmail Setup</a>
                    <ul className="pl-4 mt-1 space-y-1 text-xs text-gray-600">
                      <li><a href="#step1" className="hover:text-blue-600">1. Create Google Cloud Project</a></li>
                      <li><a href="#step2" className="hover:text-blue-600">2. Enable Gmail API</a></li>
                      <li><a href="#step3" className="hover:text-blue-600">3. OAuth Consent Screen</a></li>
                      <li><a href="#step4" className="hover:text-blue-600">4. OAuth Credentials</a></li>
                      <li><a href="#step5" className="hover:text-blue-600">5. Environment Variables</a></li>
                      <li><a href="#connecting-gmail" className="hover:text-blue-600">6. Connecting to Gmail</a></li>
                    </ul>
                  </li>
                  <li className="mt-3">
                    <a href="#gemini-setup" className="text-blue-600 hover:underline">Gemini AI Setup</a>
                    <ul className="pl-4 mt-1 space-y-1 text-xs text-gray-600">
                      <li><a href="#gemini-step1" className="hover:text-blue-600">1. Get API Key</a></li>
                      <li><a href="#gemini-step2" className="hover:text-blue-600">2. Configure ReadyReply</a></li>
                      <li><a href="#gemini-step3" className="hover:text-blue-600">3. Model Selection</a></li>
                    </ul>
                  </li>
                  <li className="mt-3">
                    <a href="#troubleshooting" className="text-blue-600 hover:underline">Troubleshooting</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-9 prose prose-lg max-w-none">
          {/* Gmail Setup Section */}
          <section id="gmail-setup">
            <div className="flex items-center mb-4">
              <img src={gmailLogo} alt="Gmail Logo" className="h-8 mr-3" />
              <h2 className="m-0">Setting up Gmail Integration</h2>
            </div>
            <p>
              To use ReadyReply with your Gmail account, you need to set up a Google Cloud project
              and configure OAuth credentials. Follow these steps carefully:
            </p>
            
            <div id="step1" className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">1</span>
                Create a Google Cloud Project
              </h3>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600">Google Cloud Console</a></li>
                <li>Click on the project dropdown at the top of the page</li>
                <li>Click "New Project"</li>
                <li>Enter a name for your project (e.g. "ReadyReply")</li>
                <li>Click "Create"</li>
                <li>Wait for the project to be created, then select it from the projects list</li>
              </ol>
            </div>
            
            <div id="step2" className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">2</span>
                Enable the Gmail API
              </h3>
              <ol className="list-decimal pl-6 space-y-3">
                <li>In your Google Cloud project, go to "APIs & Services" then "Library"</li>
                <li>Search for "Gmail API" and click on it</li>
                <li>Click "Enable"</li>
              </ol>
            </div>
            
            <div id="step3" className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">3</span>
                Configure the OAuth Consent Screen
              </h3>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Go to "APIs & Services" then "OAuth consent screen"</li>
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
            
            <div id="step4" className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">4</span>
                Create OAuth Credentials
              </h3>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Go to "APIs & Services" then "Credentials"</li>
                <li>Click "Create Credentials" then "OAuth client ID"</li>
                <li>Select "Web application" as the application type</li>
                <li>Name: "ReadyReply Web Client"</li>
                <li>Under "Authorized JavaScript origins", add:
                  <div className="bg-gray-100 p-2 rounded font-mono text-sm mt-2">
                    https://[your-replit-domain].replit.app
                  </div>
                </li>
                <li>Under "Authorized redirect URIs", add the following URLs:
                  <div className="bg-gray-100 p-2 rounded font-mono text-sm mt-2">
                    https://[your-replit-domain].replit.app/oauth-redirect.html<br />
                    https://[your-replit-domain].replit.app
                  </div>
                </li>
                <li>Click "Create"</li>
                <li>A popup will appear with your credentials. Take note of the "Client ID" and "Client Secret"</li>
              </ol>
            </div>
            
            <div id="step5" className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">5</span>
                Update Environment Variables
              </h3>
              <p>For security reasons, you'll need to update the environment variables in your Replit project:</p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>In your Replit project, click on the lock icon in the sidebar to access Secrets</li>
                <li>Add the following secrets:
                  <ul className="list-disc pl-6 mt-2">
                    <li><code>GMAIL_CLIENT_ID</code>: Your Client ID from step 4</li>
                    <li><code>GMAIL_CLIENT_SECRET</code>: Your Client Secret from step 4</li>
                    <li><code>GMAIL_REDIRECT_URI</code>: <code>https://[your-replit-domain].replit.app/oauth-redirect.html</code></li>
                  </ul>
                </li>
                <li>Click "Save" for each secret</li>
                <li>Restart your Replit application</li>
              </ol>
            </div>
            
            <div id="connecting-gmail" className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">6</span>
                Connecting Your Gmail Account
              </h3>
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
          </section>

          {/* Gemini Setup Section */}
          <section id="gemini-setup" className="mt-10">
            <div className="flex items-center mb-4">
              <img src={geminiLogo} alt="Gemini Logo" className="h-8 mr-3" />
              <h2 className="m-0">Setting up Gemini AI Integration</h2>
            </div>
            <p>
              To enable AI-powered email draft generation, you need to set up the Google Gemini API:
            </p>
            
            <div id="gemini-step1" className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">1</span>
                Get a Gemini API Key
              </h3>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Go to the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600">Google AI Studio</a></li>
                <li>Sign in with your Google account</li>
                <li>Click on "Get API key" in the top navigation</li>
                <li>Create a new API key or use an existing one</li>
                <li>Copy the API key to use in ReadyReply</li>
              </ol>
              <div className="bg-yellow-50 p-4 rounded-md mt-4 border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Google Gemini API keys have usage quotas and may incur charges depending 
                  on your usage. Check the <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-600">pricing page</a> for the latest information.
                </p>
              </div>
            </div>
            
            <div id="gemini-step2" className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">2</span>
                Configure ReadyReply with Your API Key
              </h3>
              <p>There are two ways to add your Gemini API key to ReadyReply:</p>
              
              <h4 className="font-medium mt-4 mb-2">Option 1: Using the Dashboard</h4>
              <ol className="list-decimal pl-6 space-y-3">
                <li>In ReadyReply, go to the Dashboard</li>
                <li>In the Gemini API Configuration card, click "Edit API Key"</li>
                <li>Enter your Gemini API key in the dialog</li>
                <li>Click "Connect" to save and test the connection</li>
              </ol>
              
              <h4 className="font-medium mt-4 mb-2">Option 2: Using Environment Variables</h4>
              <ol className="list-decimal pl-6 space-y-3">
                <li>In your Replit project, click on the lock icon in the sidebar to access Secrets</li>
                <li>Add a new secret with the key <code>GEMINI_API_KEY</code> and your API key as the value</li>
                <li>Click "Save"</li>
                <li>Restart your Replit application</li>
              </ol>
            </div>
            
            <div id="gemini-step3" className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">3</span>
                Model Selection and Configuration
              </h3>
              <p>ReadyReply supports different Gemini model versions with varying capabilities:</p>
              
              <div className="mt-4 grid gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-1">Gemini 1.5 Pro</h4>
                  <p className="text-sm text-gray-600">Best for advanced email response generation with nuanced understanding of context</p>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-1">Gemini 1.5 Flash</h4>
                  <p className="text-sm text-gray-600">Faster response generation with good quality output</p>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-1">Gemini 1.0 Pro</h4>
                  <p className="text-sm text-gray-600">Previous generation model with reliable performance</p>
                </div>
              </div>
              
              <p className="mt-4">You can select your preferred model in the Gemini API Configuration card on the Dashboard or in the Settings page.</p>
            </div>
          </section>
          
          {/* Troubleshooting Section */}
          <section id="troubleshooting" className="mt-10">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Troubleshooting</h3>
              
              <h4 className="font-medium text-blue-800 mt-4 mb-2">Gmail Connection Issues</h4>
              <ul className="list-disc pl-6 space-y-2 text-blue-700">
                <li>Make sure all the required scopes are added to your OAuth consent screen</li>
                <li>Verify that your redirect URIs are correctly configured and match the environment variable</li>
                <li>Check that your environment variables match the OAuth credentials exactly</li>
                <li>If you get an "invalid_grant" error, try recreating the OAuth credentials</li>
                <li>Ensure your Google account is added as a test user in your OAuth consent screen</li>
              </ul>
              
              <h4 className="font-medium text-blue-800 mt-4 mb-2">Gemini API Issues</h4>
              <ul className="list-disc pl-6 space-y-2 text-blue-700">
                <li>Make sure your API key is valid and not expired</li>
                <li>Check if you have sufficient quota available for your Gemini API key</li>
                <li>Verify that the model you've selected is available with your API key</li>
                <li>If you're experiencing rate limiting, try adjusting the rate limit in settings</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
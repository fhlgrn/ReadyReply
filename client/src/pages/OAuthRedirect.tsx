import { useEffect } from 'react';

/**
 * This component is meant to be hosted at the external domain
 * that's registered as the redirect URI in Google Cloud Console.
 * It will forward the authorization code to the parent application.
 */
export default function OAuthRedirect() {
  useEffect(() => {
    // Extract the authorization code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Send a message to the parent window with the authorization code
      // Replace 'https://your-replit-app.replit.dev' with your application's URL
      const targetOrigin = '*'; // In production, set this to your specific domain
      
      // Post message to the opener window if available
      if (window.opener) {
        window.opener.postMessage({ type: 'GMAIL_AUTH_CODE', code }, targetOrigin);
        // Close this window after sending the message
        window.close();
      } else {
        // If there's no opener, display a message to the user
        document.body.innerHTML = `
          <div style="text-align: center; margin-top: 50px;">
            <h2>Authorization Complete</h2>
            <p>Please copy this code and paste it into your ReadyReply application:</p>
            <textarea readonly style="width: 80%; height: 100px; margin: 20px auto; display: block;">${code}</textarea>
            <p>You can close this window after copying the code.</p>
          </div>
        `;
      }
    } else {
      // If no code is present, show an error
      document.body.innerHTML = `
        <div style="text-align: center; margin-top: 50px;">
          <h2>Authorization Failed</h2>
          <p>No authorization code was provided. Please try again.</p>
        </div>
      `;
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-medium mb-4">Completing Authorization...</h1>
        <p className="text-neutral-600">Please wait while we process your authentication.</p>
      </div>
    </div>
  );
}
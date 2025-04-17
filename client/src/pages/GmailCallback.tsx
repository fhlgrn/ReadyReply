import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function GmailCallback() {
  const [location, setLocation] = useLocation();
  
  // Create a navigate function using setLocation
  const navigate = (path: string) => setLocation(path);

  useEffect(() => {
    // Extract the authorization code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    console.log("Gmail callback received, code present:", !!code);
    
    if (code) {
      // Send the code to the parent window if this is a popup
      if (window.opener) {
        console.log("Sending code to parent window");
        window.opener.postMessage({ type: 'GMAIL_AUTH_CODE', code }, '*');
        window.close(); // Close the popup
      } else {
        // If not in a popup, post directly to the server
        console.log("Sending code to server directly");
        fetch('/api/auth/gmail/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })
          .then(response => response.json())
          .then(data => {
            console.log("Auth callback response:", data);
            navigate('/settings'); // Redirect to settings page
          })
          .catch(error => {
            console.error("Error in auth callback:", error);
          });
      }
    } else {
      // If no code is present, redirect to home
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-medium mb-4">Connecting to Gmail...</h1>
        <p className="text-neutral-600">Please wait while we complete the authentication.</p>
      </div>
    </div>
  );
}
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAppSettings, useAuthStatus, useGmailAuth, useGeminiAuth } from '@/lib/hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import geminiLogoPath from '../assets/gemini-logo.svg';

interface ApiCardProps {
  type: 'gmail' | 'gemini';
}

export function APIConfigCard({ type }: ApiCardProps) {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [localSettings, setLocalSettings] = useState<{
    gmailCheckFrequency?: number;
    gmailRateLimit?: number;
    geminiModel?: string;
    geminiRateLimit?: number;
  }>({});

  const { settings, updateSettings, isUpdating } = useAppSettings();
  const { status, isLoading: statusLoading } = useAuthStatus();
  const { 
    initiateAuth: initiateGmailAuth, 
    isPending: isGmailAuthPending,
    showAuthCodeDialog,
    setShowAuthCodeDialog,
    manualCode,
    setManualCode,
    submitManualCode
  } = useGmailAuth();
  const { updateApiKey, isPending: isGeminiAuthPending } = useGeminiAuth();

  // Update local settings when the server settings change
  useEffect(() => {
    if (settings && 
        (localSettings.gmailCheckFrequency === undefined || 
         localSettings.gmailRateLimit === undefined || 
         localSettings.geminiModel === undefined || 
         localSettings.geminiRateLimit === undefined)) {
      setLocalSettings({
        gmailCheckFrequency: settings.gmailCheckFrequency,
        gmailRateLimit: settings.gmailRateLimit,
        geminiModel: settings.geminiModel,
        geminiRateLimit: settings.geminiRateLimit,
      });
    }
  }, [settings, localSettings]);

  const isGmail = type === 'gmail';
  const title = isGmail ? 'Gmail API Configuration' : 'Gemini API Configuration';
  const logo = isGmail 
    ? "https://www.gstatic.com/images/branding/product/1x/gmail_48dp.png"
    : geminiLogoPath;

  const connectedStatus = isGmail 
    ? status?.gmail?.connected 
    : status?.gemini?.connected;

  // Memoized handlers to prevent recreating on every render
  const handleSaveSettings = useCallback(() => {
    if (isGmail) {
      updateSettings({
        gmailCheckFrequency: localSettings.gmailCheckFrequency,
        gmailRateLimit: localSettings.gmailRateLimit
      });
    } else {
      updateSettings({
        geminiModel: localSettings.geminiModel,
        geminiRateLimit: localSettings.geminiRateLimit
      });
    }
  }, [isGmail, localSettings, updateSettings]);

  const handleApiKeySubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    updateApiKey(apiKey);
    setApiKeyDialogOpen(false);
  }, [apiKey, updateApiKey]);

  const handleRateLimit = useCallback((value: number[]) => {
    if (isGmail) {
      setLocalSettings(prev => ({ ...prev, gmailRateLimit: value[0] }));
    } else {
      setLocalSettings(prev => ({ ...prev, geminiRateLimit: value[0] }));
    }
  }, [isGmail]);

  const handleFrequencyChange = useCallback((val: string) => {
    setLocalSettings(prev => ({ ...prev, gmailCheckFrequency: Number(val) }));
  }, []);

  const handleModelChange = useCallback((val: string) => {
    setLocalSettings(prev => ({ ...prev, geminiModel: val }));
  }, []);

  const handleReconnect = useCallback(() => {
    if (isGmail) {
      initiateGmailAuth();
    } else {
      setApiKeyDialogOpen(true);
    }
  }, [isGmail, initiateGmailAuth]);

  return (
    <Card className="bg-white h-full">
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <img src={logo} alt={`${isGmail ? 'Gmail' : 'Gemini'} API`} className="h-6 w-auto mr-2" />
          <h2 className="text-lg font-medium">{title}</h2>
        </div>

        <div className="mb-4">
          <div className="flex items-center text-sm">
            <span className={`inline-block w-3 h-3 rounded-full ${connectedStatus ? 'bg-green-600' : 'bg-red-600'} mr-2`}></span>
            <span className="text-neutral-600">
              {connectedStatus 
                ? `Connected to ${isGmail ? 'Gmail' : 'Gemini'} API` 
                : `Not connected to ${isGmail ? 'Gmail' : 'Gemini'} API`}
            </span>
          </div>
          <p className="text-neutral-600 text-xs mt-1">
            {statusLoading 
              ? 'Checking connection status...' 
              : connectedStatus 
                ? isGmail && status?.gmail?.email
                  ? `Connected as: ${status.gmail.email}`
                  : 'Last authenticated: Today'
                : 'Not authenticated'}
          </p>
        </div>

        <div className="space-y-4">
          {isGmail ? (
            <div>
              <label className="block text-neutral-600 text-sm font-medium mb-1">Check Frequency</label>
              <Select 
                value={String(localSettings.gmailCheckFrequency)} 
                onValueChange={handleFrequencyChange}>
                <SelectTrigger className="bg-neutral-100 border-neutral-200">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <label className="block text-neutral-600 text-sm font-medium mb-1">Model Selection</label>
              <Select 
                value={localSettings.geminiModel} 
                onValueChange={handleModelChange}>
                <SelectTrigger className="bg-neutral-100 border-neutral-200">
                  <SelectValue placeholder="Select Gemini model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                  <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                  <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="block text-neutral-600 text-sm font-medium mb-1">API Rate Limit</label>
            <div className="flex items-center">
              <Slider 
                min={1} 
                max={100} 
                step={1}
                value={[isGmail ? localSettings.gmailRateLimit || 25 : localSettings.geminiRateLimit || 15]} 
                onValueChange={handleRateLimit}
                className="w-full mr-2"
              />
              <span className="min-w-12 text-sm text-neutral-600">
                {isGmail ? localSettings.gmailRateLimit : localSettings.geminiRateLimit}/min
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleReconnect} disabled={isGmailAuthPending || isGeminiAuthPending} className="mr-2">
              {isGmail ? 'Reconnect' : 'Edit API Key'}
            </Button>
            <Button onClick={handleSaveSettings} disabled={isUpdating}>
              Save Settings
            </Button>
          </div>
        </div>
      </CardContent>

      {/* API Key Dialog for Gemini */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Gemini API Key</DialogTitle>
            <DialogDescription>
              Enter your Google API key to connect to Gemini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApiKeySubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSyC..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setApiKeyDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!apiKey}>
                Connect
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Gmail Auth Code Dialog */}
      <Dialog open={showAuthCodeDialog} onOpenChange={setShowAuthCodeDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Enter Gmail Authorization Code</DialogTitle>
            <DialogDescription>
              After authorizing in the popup window, copy and paste the authorization code here.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
            <h4 className="font-semibold text-amber-800 mb-2">Authorization Instructions</h4>
            <ol className="list-decimal pl-5 space-y-2 text-amber-700">
              <li>A new window should have opened with Google's authorization page</li>
              <li>Select your Google account and grant the requested permissions</li>
              <li>After approval, you'll see a code displayed on screen</li>
              <li>Copy that code and paste it in the box below</li>
              <li>If the window didn't open, check your popup blocker settings</li>
            </ol>
          </div>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="authCode">Authorization Code</Label>
              <Textarea
                id="authCode"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter the code from Google's authorization page..."
                className="h-24"
                required
              />
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
            <h4 className="font-semibold text-blue-800 mb-2">Troubleshooting Tips</h4>
            <ul className="list-disc pl-5 space-y-1 text-blue-700">
              <li>Make sure you've set up a Google Cloud Project with the Gmail API enabled</li>
              <li>Ensure your OAuth consent screen is properly configured</li>
              <li>Verify that your OAuth credentials include the correct redirect URI</li>
              <li>If you're still having issues, try using the authorization code directly from 
                  the Google authorization page's URL (after <code>code=</code> and before <code>&scope</code>)</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAuthCodeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitManualCode} disabled={!manualCode}>
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
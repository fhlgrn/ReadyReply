import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAppSettings, useAuthStatus, useGmailAuth, useClaudeAuth } from '@/lib/hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface ApiCardProps {
  type: 'gmail' | 'claude';
}

export function APIConfigCard({ type }: ApiCardProps) {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { settings, updateSettings, isUpdating } = useAppSettings();
  const { status, isLoading: statusLoading } = useAuthStatus();
  const { initiateAuth: initiateGmailAuth, isPending: isGmailAuthPending } = useGmailAuth();
  const { updateApiKey, isPending: isClaudeAuthPending } = useClaudeAuth();

  const isGmail = type === 'gmail';
  const title = isGmail ? 'Gmail API Configuration' : 'Claude API Configuration';
  const logo = isGmail 
    ? "https://www.gstatic.com/images/branding/product/1x/gmail_48dp.png"
    : "https://www.anthropic.com/images/favicon.ico";

  const connectedStatus = isGmail 
    ? status?.gmail?.connected 
    : status?.claude?.connected;

  const handleSaveSettings = () => {
    if (isGmail) {
      updateSettings({
        gmailCheckFrequency: settings?.gmailCheckFrequency,
        gmailRateLimit: settings?.gmailRateLimit
      });
    } else {
      updateSettings({
        claudeModel: settings?.claudeModel,
        claudeRateLimit: settings?.claudeRateLimit
      });
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateApiKey(apiKey);
    setApiKeyDialogOpen(false);
  };

  const handleRateLimit = (value: number[]) => {
    if (isGmail) {
      updateSettings({ gmailRateLimit: value[0] });
    } else {
      updateSettings({ claudeRateLimit: value[0] });
    }
  };

  const handleReconnect = () => {
    if (isGmail) {
      initiateGmailAuth();
    } else {
      setApiKeyDialogOpen(true);
    }
  };

  return (
    <Card className="bg-white h-full">
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <img src={logo} alt={`${isGmail ? 'Gmail' : 'Claude'} API`} className="h-6 w-auto mr-2" />
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center text-sm">
            <span className={`inline-block w-3 h-3 rounded-full ${connectedStatus ? 'bg-green-600' : 'bg-red-600'} mr-2`}></span>
            <span className="text-neutral-600">
              {connectedStatus 
                ? `Connected to ${isGmail ? 'Gmail' : 'Claude'} API` 
                : `Not connected to ${isGmail ? 'Gmail' : 'Claude'} API`}
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
              <Select value={String(settings?.gmailCheckFrequency)} onValueChange={(val) => updateSettings({ gmailCheckFrequency: Number(val) })}>
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
              <Select value={settings?.claudeModel} onValueChange={(val) => updateSettings({ claudeModel: val })}>
                <SelectTrigger className="bg-neutral-100 border-neutral-200">
                  <SelectValue placeholder="Select Claude model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude-3-7-sonnet-20250219">Claude 3 Sonnet</SelectItem>
                  <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                  <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
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
                defaultValue={[isGmail ? settings?.gmailRateLimit || 25 : settings?.claudeRateLimit || 15]} 
                onValueChange={handleRateLimit}
                className="w-full mr-2"
              />
              <span className="min-w-12 text-sm text-neutral-600">
                {isGmail ? settings?.gmailRateLimit : settings?.claudeRateLimit}/min
              </span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleReconnect} disabled={isGmailAuthPending || isClaudeAuthPending} className="mr-2">
              {isGmail ? 'Reconnect' : 'Edit API Key'}
            </Button>
            <Button onClick={handleSaveSettings} disabled={isUpdating}>
              Save Settings
            </Button>
          </div>
        </div>
      </CardContent>

      {/* API Key Dialog for Claude */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Claude API Key</DialogTitle>
            <DialogDescription>
              Enter your Anthropic API key to connect to Claude.
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
                  placeholder="sk-ant-api03-..."
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
    </Card>
  );
}

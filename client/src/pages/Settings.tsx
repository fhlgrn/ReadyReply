import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { useAppSettings, useGmailAuth, useGeminiAuth, useAuthStatus } from '@/lib/hooks';

export default function Settings() {
  const { settings, updateSettings, isUpdating } = useAppSettings();
  const { initiateAuth: initiateGmailAuth, isPending: isGmailAuthPending } = useGmailAuth();
  const { updateApiKey, isPending: isGeminiAuthPending } = useGeminiAuth();
  const { status } = useAuthStatus();
  const [geminiApiKey, setGeminiApiKey] = React.useState('');
  
  const handleToggleService = (checked: boolean) => {
    updateSettings({ serviceEnabled: checked });
  };
  
  const handleUpdateGeminiApiKey = () => {
    if (geminiApiKey) {
      updateApiKey(geminiApiKey);
      setGeminiApiKey('');
    }
  };
  
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-medium text-neutral-900">Settings</h1>
        <p className="text-neutral-600">Configure application settings and API connections</p>
      </header>
      
      <div className="space-y-6">
        {/* Service Settings */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Service Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Service Status</Label>
                  <p className="text-sm text-neutral-500">Enable or disable the email automation service</p>
                </div>
                <ToggleSwitch
                  checked={settings?.serviceEnabled || false}
                  onChange={handleToggleService}
                  disabled={isUpdating}
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-base">Email Check Frequency</Label>
                <Select 
                  value={String(settings?.gmailCheckFrequency)} 
                  onValueChange={(val) => updateSettings({ gmailCheckFrequency: Number(val) })}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Every 5 minutes</SelectItem>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                    <SelectItem value="60">Every hour</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-neutral-500">How often the service checks for new emails</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* API Connections */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">API Connections</h2>
            
            <div className="space-y-6">
              {/* Gmail API */}
              <div className="border-b border-neutral-200 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Label className="text-base">Gmail API</Label>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${status?.gmail?.connected ? 'bg-green-600' : 'bg-red-600'} mr-2`}></span>
                      <span className="text-sm text-neutral-600">
                        {status?.gmail?.connected 
                          ? `Connected as: ${status.gmail.email}` 
                          : 'Not connected'}
                      </span>
                    </div>
                  </div>
                  <Button 
                    onClick={initiateGmailAuth} 
                    disabled={isGmailAuthPending}
                    variant="outline"
                  >
                    {status?.gmail?.connected ? 'Reconnect' : 'Connect'}
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">API Rate Limit</Label>
                    <div className="flex items-center">
                      <Slider
                        min={1}
                        max={100}
                        step={1}
                        value={[settings?.gmailRateLimit || 25]}
                        onValueChange={(value) => updateSettings({ gmailRateLimit: value[0] })}
                        disabled={isUpdating}
                        className="w-full mr-2"
                      />
                      <span className="min-w-12 text-sm text-neutral-600">
                        {settings?.gmailRateLimit || 25}/min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Gemini API */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Label className="text-base">Gemini API</Label>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${status?.gemini?.connected ? 'bg-green-600' : 'bg-red-600'} mr-2`}></span>
                      <span className="text-sm text-neutral-600">
                        {status?.gemini?.connected 
                          ? 'Connected' 
                          : 'Not connected'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">Google API Key</Label>
                    <div className="flex mt-1">
                      <Input
                        type="password"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        placeholder="AIzaSyC..."
                        className="max-w-md"
                      />
                      <Button 
                        onClick={handleUpdateGeminiApiKey} 
                        disabled={isGeminiAuthPending || !geminiApiKey}
                        className="ml-2"
                      >
                        {status?.gemini?.connected ? 'Update Key' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Model Selection</Label>
                    <Select 
                      value={settings?.geminiModel} 
                      onValueChange={(val) => updateSettings({ geminiModel: val })}
                      disabled={isUpdating}
                      className="max-w-md"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gemini model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                        <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                        <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm">API Rate Limit</Label>
                    <div className="flex items-center">
                      <Slider
                        min={1}
                        max={100}
                        step={1}
                        value={[settings?.geminiRateLimit || 15]}
                        onValueChange={(value) => updateSettings({ geminiRateLimit: value[0] })}
                        disabled={isUpdating}
                        className="w-full mr-2"
                      />
                      <span className="min-w-12 text-sm text-neutral-600">
                        {settings?.geminiRateLimit || 15}/min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

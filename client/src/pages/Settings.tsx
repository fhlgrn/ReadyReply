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
import { useAppSettings, useGmailAuth, useClaudeAuth, useAuthStatus } from '@/lib/hooks';

export default function Settings() {
  const { settings, updateSettings, isUpdating } = useAppSettings();
  const { initiateAuth: initiateGmailAuth, isPending: isGmailAuthPending } = useGmailAuth();
  const { updateApiKey, isPending: isClaudeAuthPending } = useClaudeAuth();
  const { status } = useAuthStatus();
  const [claudeApiKey, setClaudeApiKey] = React.useState('');
  
  const handleToggleService = (checked: boolean) => {
    updateSettings({ serviceEnabled: checked });
  };
  
  const handleUpdateClaudeApiKey = () => {
    if (claudeApiKey) {
      updateApiKey(claudeApiKey);
      setClaudeApiKey('');
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
              
              {/* Claude API */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Label className="text-base">Claude API</Label>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block w-3 h-3 rounded-full ${status?.claude?.connected ? 'bg-green-600' : 'bg-red-600'} mr-2`}></span>
                      <span className="text-sm text-neutral-600">
                        {status?.claude?.connected 
                          ? 'Connected' 
                          : 'Not connected'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">Anthropic API Key</Label>
                    <div className="flex mt-1">
                      <Input
                        type="password"
                        value={claudeApiKey}
                        onChange={(e) => setClaudeApiKey(e.target.value)}
                        placeholder="sk-ant-api03-..."
                        className="max-w-md"
                      />
                      <Button 
                        onClick={handleUpdateClaudeApiKey} 
                        disabled={isClaudeAuthPending || !claudeApiKey}
                        className="ml-2"
                      >
                        {status?.claude?.connected ? 'Update Key' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Model Selection</Label>
                    <Select 
                      value={settings?.claudeModel} 
                      onValueChange={(val) => updateSettings({ claudeModel: val })}
                      disabled={isUpdating}
                      className="max-w-md"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Claude model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude-3-7-sonnet-20250219">Claude 3 Sonnet</SelectItem>
                        <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                        <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
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
                        value={[settings?.claudeRateLimit || 15]}
                        onValueChange={(value) => updateSettings({ claudeRateLimit: value[0] })}
                        disabled={isUpdating}
                        className="w-full mr-2"
                      />
                      <span className="min-w-12 text-sm text-neutral-600">
                        {settings?.claudeRateLimit || 15}/min
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

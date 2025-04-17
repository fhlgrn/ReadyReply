import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleSwitch } from './ToggleSwitch';
import { useAppStats } from '@/lib/hooks';
import { useServiceStatus } from '@/lib/hooks';
import { useAppSettings } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function StatusCard() {
  const { stats, isLoading: statsLoading } = useAppStats();
  const { settings, isLoading: settingsLoading } = useAppSettings();
  const { toggleService, isToggling, processEmails, isProcessing } = useServiceStatus();

  const handleToggleService = (enabled: boolean) => {
    toggleService(enabled);
  };

  const handleProcessEmails = () => {
    processEmails();
  };

  if (settingsLoading || statsLoading) {
    return (
      <Card className="bg-white mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium">Service Status</h2>
              <p className="text-neutral-600 text-sm">Current status of your email automation</p>
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statBoxes = [
    { label: 'Emails Processed', value: stats?.emailsProcessed || 0, icon: 'mail', color: 'text-blue-600' },
    { label: 'Drafts Created', value: stats?.draftsCreated || 0, icon: 'check_circle', color: 'text-green-600' },
    { label: 'Processing Warnings', value: stats?.warnings || 0, icon: 'warning', color: 'text-yellow-600' },
    { label: 'Processing Errors', value: stats?.errors || 0, icon: 'error', color: 'text-red-600' },
  ];

  return (
    <Card className="bg-white mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Service Status</h2>
            <p className="text-neutral-600 text-sm">Current status of your email automation</p>
          </div>
          <div className="flex items-center gap-2">
            <ToggleSwitch
              checked={settings?.serviceEnabled || false}
              onChange={handleToggleService}
              label="Enabled"
              disabled={isToggling}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleProcessEmails}
              disabled={isProcessing || !settings?.serviceEnabled}
              className="ml-2"
            >
              <span className="material-icons text-sm mr-1">refresh</span>
              Process Now
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {statBoxes.map((box, index) => (
            <div key={index} className="p-3 bg-neutral-100 rounded-lg">
              <div className="flex items-center">
                <span className={`material-icons ${box.color} mr-2`}>{box.icon}</span>
                <span className="font-medium">{box.value}</span>
              </div>
              <p className="text-neutral-600 text-sm mt-1">{box.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

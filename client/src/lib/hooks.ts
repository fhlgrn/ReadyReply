import { useState, useEffect } from 'react';
import { AppSettings, Filter, AppStats, ProcessingLog, PaginatedLogs, AuthStatus } from './types';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from './queryClient';
import { queryClient } from './queryClient';
import { useToast } from '@/hooks/use-toast';

// Service Status
export function useServiceStatus() {
  const { toast } = useToast();
  
  const toggleServiceMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const res = await apiRequest('PATCH', '/api/settings', { serviceEnabled: enabled });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: 'Service updated',
        description: 'Service status has been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating service',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const manualProcessMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/process');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/logs'] });
      toast({
        title: 'Processing complete',
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error processing emails',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  return {
    toggleService: toggleServiceMutation.mutate,
    isToggling: toggleServiceMutation.isPending,
    processEmails: manualProcessMutation.mutate,
    isProcessing: manualProcessMutation.isPending,
    processResult: manualProcessMutation.data,
  };
}

// Auth Status
export function useAuthStatus() {
  const { data, isLoading, error, refetch } = useQuery<AuthStatus>({
    queryKey: ['/api/status'],
  });
  
  return {
    status: data,
    isLoading,
    error,
    refetch,
  };
}

// Gmail Auth
export function useGmailAuth() {
  const { toast } = useToast();
  const [authUrl, setAuthUrl] = useState('');
  
  const getAuthUrlQuery = useQuery({
    queryKey: ['/api/auth/gmail/url'],
    enabled: false,
    select: (data: any) => {
      setAuthUrl(data.url);
      return data;
    },
  });
  
  const authCallbackMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest('POST', '/api/auth/gmail/callback', { code });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/status'] });
      toast({
        title: 'Gmail connected',
        description: 'Successfully connected to Gmail',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error connecting to Gmail',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const initiateAuth = () => {
    getAuthUrlQuery.refetch();
  };
  
  // Extract code from URL when redirected back from Google OAuth
  useEffect(() => {
    if (authUrl && !authCallbackMutation.isPending) {
      window.open(authUrl, 'gmailAuth', 'width=600,height=600');
    }
  }, [authUrl]);
  
  // Listen for message from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'GMAIL_AUTH_CODE') {
        authCallbackMutation.mutate(event.data.code);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  return {
    initiateAuth,
    isPending: getAuthUrlQuery.isFetching || authCallbackMutation.isPending,
    isSuccess: authCallbackMutation.isSuccess,
  };
}

// Gemini Auth
export function useGeminiAuth() {
  const { toast } = useToast();
  
  const updateApiKeyMutation = useMutation({
    mutationFn: async (apiKey: string) => {
      const res = await apiRequest('POST', '/api/auth/gemini/key', { apiKey });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/status'] });
      toast({
        title: 'Gemini API key updated',
        description: 'Successfully connected to Gemini',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error connecting to Gemini',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  return {
    updateApiKey: updateApiKeyMutation.mutate,
    isPending: updateApiKeyMutation.isPending,
    isSuccess: updateApiKeyMutation.isSuccess,
  };
}

// App Settings
export function useAppSettings() {
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery<AppSettings>({
    queryKey: ['/api/settings'],
  });
  
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<AppSettings>) => {
      const res = await apiRequest('PATCH', '/api/settings', settings);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: 'Settings updated',
        description: 'Settings have been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating settings',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  return {
    settings: data,
    isLoading,
    error,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
}

// Filters
export function useFilters() {
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery<Filter[]>({
    queryKey: ['/api/filters'],
  });
  
  const createFilterMutation = useMutation({
    mutationFn: async (filter: Omit<Filter, 'id' | 'createdAt'>) => {
      const res = await apiRequest('POST', '/api/filters', filter);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/filters'] });
      toast({
        title: 'Filter created',
        description: 'New filter has been created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating filter',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const updateFilterMutation = useMutation({
    mutationFn: async ({ id, ...filter }: Partial<Filter> & { id: number }) => {
      const res = await apiRequest('PATCH', `/api/filters/${id}`, filter);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/filters'] });
      toast({
        title: 'Filter updated',
        description: 'Filter has been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating filter',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const deleteFilterMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/filters/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/filters'] });
      toast({
        title: 'Filter deleted',
        description: 'Filter has been deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting filter',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Toggle filter enabled status
  const toggleFilterMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: number; enabled: boolean }) => {
      const res = await apiRequest('PATCH', `/api/filters/${id}`, { enabled });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/filters'] });
    },
    onError: (error) => {
      toast({
        title: 'Error toggling filter',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  return {
    filters: data || [],
    isLoading,
    error,
    createFilter: createFilterMutation.mutate,
    isCreating: createFilterMutation.isPending,
    updateFilter: updateFilterMutation.mutate,
    isUpdating: updateFilterMutation.isPending,
    deleteFilter: deleteFilterMutation.mutate,
    isDeleting: deleteFilterMutation.isPending,
    toggleFilter: toggleFilterMutation.mutate,
    isToggling: toggleFilterMutation.isPending,
  };
}

// App Stats
export function useAppStats() {
  const { data, isLoading, error } = useQuery<AppStats>({
    queryKey: ['/api/stats'],
  });
  
  return {
    stats: data,
    isLoading,
    error,
  };
}

// Processing Logs
export function useProcessingLogs(page: number = 1, limit: number = 10) {
  const { data, isLoading, error } = useQuery<PaginatedLogs>({
    queryKey: ['/api/logs', { page, limit }],
  });
  
  return {
    data,
    isLoading,
    error,
  };
}

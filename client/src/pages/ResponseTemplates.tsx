import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFilters } from '@/lib/hooks';
import { Filter } from '@/lib/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';

export default function ResponseTemplates() {
  const { filters } = useFilters();
  const [, navigate] = useLocation();
  
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-medium text-neutral-900">AI Email Responses</h1>
        <p className="text-neutral-600">
          AI generates contextual responses based on email content
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-medium mb-4">Filters for Auto-Response</h2>
              
              {filters.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <span className="material-icons text-4xl mb-2">description</span>
                  <p>No filters available for automated responses</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/filters')}
                  >
                    Create a filter first
                  </Button>
                </div>
              ) : (
                <Tabs defaultValue={filters[0]?.id.toString()}>
                  <TabsList className="mb-4">
                    {filters.map(filter => (
                      <TabsTrigger 
                        key={filter.id} 
                        value={filter.id.toString()}
                      >
                        {filter.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {filters.map(filter => (
                    <TabsContent key={filter.id} value={filter.id.toString()}>
                      <div className="space-y-4">
                        <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-neutral-500 font-medium">Status:</span> {filter.enabled ? 'Enabled' : 'Disabled'}
                          </div>
                          <div>
                            <span className="text-neutral-500 font-medium">Starred:</span> {filter.isStarred ? 'Yes' : 'No'}
                          </div>
                          <div>
                            <span className="text-neutral-500 font-medium">From:</span> {filter.fromEmail || '—'}
                          </div>
                          <div>
                            <span className="text-neutral-500 font-medium">Subject contains:</span> {filter.subjectContains || '—'}
                          </div>
                          <div>
                            <span className="text-neutral-500 font-medium">Body contains:</span> {filter.bodyContains || '—'}
                          </div>
                          <div>
                            <span className="text-neutral-500 font-medium">Has no label:</span> {filter.hasNoLabel || '—'}
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="text-sm font-medium text-blue-800 mb-2">AI Response</h3>
                          <p className="text-sm text-blue-700">
                            When emails match this filter, the AI will generate a contextual response
                            that addresses the specific points in the email, maintaining a professional tone
                            and keeping responses concise.
                          </p>
                        </div>

                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/filters')}
                          >
                            <span className="material-icons text-sm mr-1">edit</span>
                            Edit Filter
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-medium mb-4">Response Features</h2>
              <p className="text-sm text-neutral-600 mb-4">
                The AI will create personalized responses to emails based on their content.
              </p>
              
              <div className="space-y-3">
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                  <Label className="text-blue-600">Contextual Understanding</Label>
                  <p className="text-sm text-neutral-600 mt-1">Analyzes email content and responds to specific points</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                  <Label className="text-blue-600">Professional Tone</Label>
                  <p className="text-sm text-neutral-600 mt-1">Maintains a professional and friendly writing style</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                  <Label className="text-blue-600">Concise Responses</Label>
                  <p className="text-sm text-neutral-600 mt-1">Generates responses within your configured word limit</p>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800">Best Practices</h3>
                <ul className="mt-2 text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>Create specific filters for different email types</li>
                  <li>Adjust word limit in Settings for longer or shorter responses</li>
                  <li>Always review AI-generated drafts before sending</li>
                  <li>Test filters with the "Process Now" button</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

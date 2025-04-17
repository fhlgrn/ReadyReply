import React from 'react';
import { FilterList } from '@/components/FilterList';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function EmailFilters() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-medium text-neutral-900">Gemini Email Filters</h1>
        <p className="text-neutral-600">Configure filters and Gemini-powered responses for your emails</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <FilterList />
        </div>
        
        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-medium mb-4">Gemini Response Features</h2>
              <p className="text-sm text-neutral-600 mb-4">
                The Gemini AI will create personalized responses to emails based on their content.
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

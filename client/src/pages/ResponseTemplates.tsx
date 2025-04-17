import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useFilters } from '@/lib/hooks';
import { Filter } from '@/lib/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

export default function ResponseTemplates() {
  const { filters, updateFilter } = useFilters();
  const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
  const [editedTemplate, setEditedTemplate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEditTemplate = (filter: Filter) => {
    setActiveFilter(filter);
    setEditedTemplate(filter.responseTemplate);
    setIsEditing(true);
  };
  
  const handleSaveTemplate = async () => {
    if (activeFilter) {
      await updateFilter({
        id: activeFilter.id,
        responseTemplate: editedTemplate
      });
      setIsEditing(false);
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const templateVariables = [
    { name: '[TOPIC]', description: 'Main topic of the email' },
    { name: '[SPECIFIC POINTS]', description: 'Key points from the email that need addressing' },
    { name: '[CUSTOM RESPONSE]', description: 'Claude will replace this with content specific to the email' },
    { name: '[YOUR NAME]', description: 'Your name or signature' },
  ];
  
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-medium text-neutral-900">Response Templates</h1>
        <p className="text-neutral-600">
          Manage templates that Gemini will use to generate email responses
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-medium mb-4">Templates by Filter</h2>
              
              {filters.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <span className="material-icons text-4xl mb-2">description</span>
                  <p>No filters with templates available</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.href = '/filters'}
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
                        onClick={() => setActiveFilter(filter)}
                      >
                        {filter.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {filters.map(filter => (
                    <TabsContent key={filter.id} value={filter.id.toString()}>
                      <div className="space-y-4">
                        {isEditing && activeFilter?.id === filter.id ? (
                          <>
                            <Textarea
                              value={editedTemplate}
                              onChange={(e) => setEditedTemplate(e.target.value)}
                              className="min-h-32 font-mono text-sm"
                            />
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={handleCancelEdit}>
                                Cancel
                              </Button>
                              <Button onClick={handleSaveTemplate}>
                                Save Template
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 whitespace-pre-wrap font-mono text-sm">
                              {filter.responseTemplate}
                            </div>
                            <div className="flex justify-end">
                              <Button 
                                variant="outline" 
                                onClick={() => handleEditTemplate(filter)}
                              >
                                <span className="material-icons text-sm mr-1">edit</span>
                                Edit Template
                              </Button>
                            </div>
                          </>
                        )}
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
              <h2 className="text-lg font-medium mb-4">Template Variables</h2>
              <p className="text-sm text-neutral-600 mb-4">
                Use these placeholders in your templates. Gemini will replace them with relevant content.
              </p>
              
              <div className="space-y-3">
                {templateVariables.map((variable, index) => (
                  <div key={index} className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                    <Label className="text-blue-600 font-mono">{variable.name}</Label>
                    <p className="text-sm text-neutral-600 mt-1">{variable.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800">Template Tips</h3>
                <ul className="mt-2 text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>Keep templates professional but conversational</li>
                  <li>Include placeholders for personalized content</li>
                  <li>Gemini works best with clear instructions</li>
                  <li>Review generated drafts before sending</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

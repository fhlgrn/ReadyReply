import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToggleSwitch } from './ToggleSwitch';
import { useFilters } from '@/lib/hooks';
import { Filter } from '@/lib/types';

interface AddFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editFilter?: Filter;
}

const formSchema = z.object({
  name: z.string().min(1, 'Filter name is required'),
  enabled: z.boolean().default(true),
  fromEmail: z.string().optional(),
  subjectContains: z.string().optional(),
  bodyContains: z.string().optional(),
  hasNoLabel: z.string().optional(),
  responseTemplate: z.string().min(1, 'Response template is required'),
});

export function AddFilterDialog({ open, onOpenChange, editFilter }: AddFilterDialogProps) {
  const { createFilter, updateFilter, isCreating, isUpdating } = useFilters();
  const isEditing = !!editFilter;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editFilter ? {
      name: editFilter.name,
      enabled: editFilter.enabled,
      fromEmail: editFilter.fromEmail || '',
      subjectContains: editFilter.subjectContains || '',
      bodyContains: editFilter.bodyContains || '',
      hasNoLabel: editFilter.hasNoLabel || '',
      responseTemplate: editFilter.responseTemplate,
    } : {
      name: '',
      enabled: true,
      fromEmail: '',
      subjectContains: '',
      bodyContains: '',
      hasNoLabel: '',
      responseTemplate: 'Thank you for your email. I received your message regarding [TOPIC] and will address your concerns about [SPECIFIC POINTS]. [CUSTOM RESPONSE BASED ON EMAIL CONTENT].\n\nBest regards,\n[YOUR NAME]',
    },
  });
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Clean up empty strings
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (typeof value === 'string' && value.trim() === '') {
          return [key, undefined];
        }
        return [key, value];
      })
    );
    
    if (isEditing && editFilter) {
      await updateFilter({ id: editFilter.id, ...cleanedData });
    } else {
      await createFilter(cleanedData);
    }
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Filter' : 'Add New Filter'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filter Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Customer Support Inquiries" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Enabled</FormLabel>
                        <FormDescription>
                          Activate this filter
                        </FormDescription>
                      </div>
                      <FormControl>
                        <ToggleSwitch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Filter Criteria</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <FormField
                    control={form.control}
                    name="fromEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Email</FormLabel>
                        <FormControl>
                          <Input placeholder="*@customer.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Use * as wildcard (e.g., *@domain.com)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <FormField
                    control={form.control}
                    name="hasNoLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Has No Label</FormLabel>
                        <FormControl>
                          <Input placeholder="Processed" {...field} />
                        </FormControl>
                        <FormDescription>
                          Only match emails without this label
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="subjectContains"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Contains</FormLabel>
                        <FormControl>
                          <Input placeholder="support, help, issue" {...field} />
                        </FormControl>
                        <FormDescription>
                          Comma-separated keywords
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="bodyContains"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Contains</FormLabel>
                        <FormControl>
                          <Input placeholder="not working, broken, problem" {...field} />
                        </FormControl>
                        <FormDescription>
                          Comma-separated keywords
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Response Template</h3>
              <FormField
                control={form.control}
                name="responseTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Thank you for contacting our support team..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Claude will use this as a guideline when creating draft replies
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isEditing ? 'Update Filter' : 'Create Filter'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

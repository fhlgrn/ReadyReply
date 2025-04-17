import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFilters } from '@/lib/hooks';
import { FilterItem } from './FilterItem';
import { AddFilterDialog } from './AddFilterDialog';
import { Skeleton } from '@/components/ui/skeleton';

export function FilterList() {
  const { filters, isLoading } = useFilters();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  if (isLoading) {
    return (
      <Card className="bg-white mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Email Filters</h2>
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Email Filters</h2>
          <Button onClick={() => setDialogOpen(true)}>
            <span className="material-icons text-sm mr-1">add</span>
            Add Filter
          </Button>
        </div>
        
        {filters.length > 0 ? (
          filters.map(filter => (
            <FilterItem key={filter.id} filter={filter} />
          ))
        ) : (
          <div className="text-center py-8 text-neutral-500">
            <span className="material-icons text-4xl mb-2">filter_alt_off</span>
            <p>No filters configured yet</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setDialogOpen(true)}
            >
              Create your first filter
            </Button>
          </div>
        )}
        
        <AddFilterDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </CardContent>
    </Card>
  );
}

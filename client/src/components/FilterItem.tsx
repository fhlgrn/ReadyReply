import React, { useState } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { Filter } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFilters } from '@/lib/hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AddFilterDialog } from './AddFilterDialog';

interface FilterItemProps {
  filter: Filter;
}

export function FilterItem({ filter }: FilterItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toggleFilter, deleteFilter } = useFilters();

  const handleToggle = (checked: boolean) => {
    toggleFilter({ id: filter.id, enabled: checked });
  };

  const handleDelete = () => {
    deleteFilter(filter.id);
    setConfirmDelete(false);
  };

  const filterCriteria = [
    filter.fromEmail && {
      icon: 'person',
      label: 'From:',
      value: filter.fromEmail
    },
    filter.subjectContains && {
      icon: 'subject',
      label: 'Subject contains:',
      value: filter.subjectContains
    },
    filter.bodyContains && {
      icon: 'description',
      label: 'Body contains:',
      value: filter.bodyContains
    },
    filter.hasNoLabel && {
      icon: 'label_important',
      label: 'Has no label:',
      value: filter.hasNoLabel
    }
  ].filter(Boolean);

  return (
    <div className="border border-neutral-200 rounded-lg mb-4 overflow-hidden">
      <div className="bg-neutral-100 p-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="material-icons text-neutral-600 mr-2">filter_list</span>
          <h3 className="font-medium">{filter.name}</h3>
        </div>
        <div className="flex items-center">
          <ToggleSwitch
            checked={filter.enabled}
            onChange={handleToggle}
            size="sm"
            className="mr-3"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-neutral-600 hover:bg-neutral-200 p-1 rounded-full">
                <span className="material-icons text-sm">more_vert</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                Edit Filter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfirmDelete(true)}>
                Delete Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-neutral-600">Filter Criteria</h4>
            <div className="space-y-3">
              {filterCriteria.map((criteria, index) => (
                <div key={index} className="flex items-center">
                  <span className="material-icons text-sm text-neutral-600 mr-2">{criteria.icon}</span>
                  <div className="text-sm">
                    <span className="text-neutral-600">{criteria.label}</span>
                    <span className="ml-1 font-medium">{criteria.value}</span>
                  </div>
                </div>
              ))}
              {filterCriteria.length === 0 && (
                <div className="text-sm text-neutral-500 italic">No filter criteria specified</div>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-neutral-600">Response Template</h4>
            <div className="border border-neutral-200 rounded-lg p-3 bg-neutral-50">
              <div className="text-sm text-neutral-600 line-clamp-3">
                {filter.responseTemplate || "No template specified"}
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <Button 
                variant="ghost" 
                className="text-blue-600 hover:bg-neutral-100 px-3 py-1.5 rounded-md text-sm"
                onClick={() => setEditDialogOpen(true)}
              >
                Edit Template
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Filter</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the filter "{filter.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Filter Dialog */}
      <AddFilterDialog 
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editFilter={filter}
      />
    </div>
  );
}

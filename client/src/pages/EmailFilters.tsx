import React from 'react';
import { FilterList } from '@/components/FilterList';

export default function EmailFilters() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-medium text-neutral-900">Email Filters</h1>
        <p className="text-neutral-600">Configure filters to determine which emails get automated responses</p>
      </header>
      
      <FilterList />
    </>
  );
}

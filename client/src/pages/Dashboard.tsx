import React from 'react';
import { StatusCard } from '@/components/StatusCard';
import { APIConfigCard } from '@/components/APIConfigCard';
import { FilterList } from '@/components/FilterList';
import { LogTable } from '@/components/LogTable';

export default function Dashboard() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-medium text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600">Manage your email automation settings</p>
      </header>
      
      <StatusCard />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <APIConfigCard type="gmail" />
        <APIConfigCard type="claude" />
      </div>
      
      <FilterList />
      
      <LogTable limit={4} compact />
    </>
  );
}

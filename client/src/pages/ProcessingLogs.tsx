import React from 'react';
import { LogTable } from '@/components/LogTable';

export default function ProcessingLogs() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-medium text-neutral-900">Processing Logs</h1>
        <p className="text-neutral-600">View the history of all processed emails and their status</p>
      </header>
      
      <LogTable />
    </>
  );
}

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProcessingLogs } from '@/lib/hooks';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ProcessingLog } from '@/lib/types';

interface LogTableProps {
  limit?: number;
  compact?: boolean;
}

export function LogTable({ limit = 10, compact = false }: LogTableProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProcessingLogs(page, limit);
  const [selectedLog, setSelectedLog] = useState<ProcessingLog | null>(null);
  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (data && page < data.pagination.pages) {
      setPage(page + 1);
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full"></span>
            Success
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <span className="w-1.5 h-1.5 mr-1.5 bg-yellow-500 rounded-full"></span>
            Warning
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="w-1.5 h-1.5 mr-1.5 bg-red-500 rounded-full"></span>
            Error
          </span>
        );
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <Card className="bg-white mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Processing Logs</h2>
            <div className="flex">
              <Skeleton className="h-9 w-24 mr-2" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Processing Logs</h2>
          <div className="flex">
            <Button variant="outline" className="mr-2">
              <span className="material-icons text-sm mr-1">refresh</span>
              Refresh
            </Button>
            <Button variant="outline">
              <span className="material-icons text-sm mr-1">file_download</span>
              Export
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Filter</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                data?.logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-neutral-600">
                      {formatDate(log.processedAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-neutral-600">
                      {log.emailFrom}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-600 max-w-xs truncate">
                      {log.emailSubject}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-neutral-600">
                      {log.filterName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-neutral-600">
                      <Button 
                        variant="link" 
                        className="text-blue-600 p-0 h-auto"
                        onClick={() => setSelectedLog(log)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {!compact && data && data.pagination.total > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-neutral-600">
            <div>
              Showing {(page - 1) * limit + 1}-{Math.min(page * limit, data.pagination.total)} of {data.pagination.total} logs
            </div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePreviousPage} 
                disabled={page === 1}
                className="p-1 rounded-md hover:bg-neutral-100 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span className="material-icons text-neutral-600">chevron_left</span>
              </Button>
              <span className="px-3">Page {page} of {data.pagination.pages}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextPage}
                disabled={page === data.pagination.pages}
                className="p-1 rounded-md hover:bg-neutral-100"
              >
                <span className="material-icons text-neutral-600">chevron_right</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Log Details Dialog */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Log Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-600">Status</h3>
                  <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-600">Date</h3>
                  <p className="text-neutral-800">{formatDate(selectedLog.processedAt)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-neutral-600">Email Details</h3>
                <div className="mt-1 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-neutral-600">From:</p>
                    <p className="text-neutral-800 font-medium">{selectedLog.emailFrom}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-neutral-600">Subject:</p>
                    <p className="text-neutral-800 font-medium">{selectedLog.emailSubject}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-neutral-600">Filter Applied:</p>
                    <p className="text-neutral-800 font-medium">{selectedLog.filterName}</p>
                  </div>
                </div>
              </div>
              
              {selectedLog.errorMessage && (
                <div>
                  <h3 className="text-sm font-medium text-red-600">Error Message</h3>
                  <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                    {selectedLog.errorMessage}
                  </div>
                </div>
              )}
              
              {selectedLog.draftId && (
                <div>
                  <h3 className="text-sm font-medium text-green-600">Draft Created</h3>
                  <p className="text-neutral-600">Draft ID: {selectedLog.draftId}</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={() => setSelectedLog(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/contexts/SocketContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LogViewer: React.FC = () => {
  const { logs, isConnected } = useSocket();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [logs]);

  const copyLogs = async () => {
    try {
      await navigator.clipboard.writeText(logs.join('\n'));
      toast({
        title: "Copied",
        description: "Logs copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy logs",
        variant: "destructive",
      });
    }
  };

  const clearLogs = () => {
    // This would need to be implemented in the socket context
    // For now, we'll just show a message
    toast({
      title: "Info",
      description: "Log clearing not implemented yet",
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            System Logs
            <Badge variant="outline">{logs.length}</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? 'Live' : 'Disconnected'}
            </Badge>
            <Button variant="outline" size="sm" onClick={copyLogs}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={clearLogs}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea ref={scrollAreaRef} className="h-[400px] w-full">
          <div className="p-4 space-y-1">
            {logs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Terminal className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No logs yet. Start the scheduler to see activity.</p>
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="text-xs font-mono p-2 rounded bg-muted/50 border"
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
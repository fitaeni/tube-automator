import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { 
  Youtube, 
  LogOut, 
  Activity, 
  Wifi, 
  WifiOff, 
  Play, 
  Square,
  Cpu,
  HardDrive
} from 'lucide-react';

export const Header: React.FC = () => {
  const { logout } = useAuth();
  const { 
    isConnected, 
    schedulerRunning, 
    systemStats, 
    startScheduler, 
    stopScheduler 
  } = useSocket();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Youtube className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Zombload Panel
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            
            <Badge variant={schedulerRunning ? "default" : "secondary"} className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Scheduler {schedulerRunning ? 'Running' : 'Stopped'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {systemStats && (
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-1">
                <Cpu className="h-4 w-4 text-info" />
                <span className="text-muted-foreground">CPU:</span>
                <span className="font-medium">{systemStats.cpu.toFixed(1)}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <HardDrive className="h-4 w-4 text-warning" />
                <span className="text-muted-foreground">RAM:</span>
                <span className="font-medium">{systemStats.ram.toFixed(1)}%</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button
              variant={schedulerRunning ? "destructive" : "default"}
              size="sm"
              onClick={schedulerRunning ? stopScheduler : startScheduler}
              disabled={!isConnected}
            >
              {schedulerRunning ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Scheduler
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Scheduler
                </>
              )}
            </Button>
            
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
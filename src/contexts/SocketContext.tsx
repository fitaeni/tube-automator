import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  schedulerRunning: boolean;
  logs: string[];
  systemStats: { cpu: number; ram: number } | null;
  startScheduler: () => void;
  stopScheduler: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [schedulerRunning, setSchedulerRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [systemStats, setSystemStats] = useState<{ cpu: number; ram: number } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io('http://localhost:5000', {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('scheduler_status', (data: { running: boolean }) => {
        setSchedulerRunning(data.running);
      });

      newSocket.on('new_log', (data: { data: string }) => {
        setLogs(prev => [...prev.slice(-99), data.data]);
      });

      newSocket.on('system_stats', (data: { cpu: number; ram: number }) => {
        setSystemStats(data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
        setLogs([]);
        setSystemStats(null);
      }
    }
  }, [isAuthenticated]);

  const startScheduler = () => {
    if (socket) {
      socket.emit('start_scheduler');
    }
  };

  const stopScheduler = () => {
    if (socket) {
      socket.emit('stop_scheduler');
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      schedulerRunning,
      logs,
      systemStats,
      startScheduler,
      stopScheduler,
    }}>
      {children}
    </SocketContext.Provider>
  );
};
import { io } from 'socket.io-client';
import API_URL from '@/config/api';

let socketInstance = null;

export const getSocket = () => {
  if (socketInstance) return socketInstance;

  socketInstance = io(API_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  });

  return socketInstance;
};

export const socket = getSocket();

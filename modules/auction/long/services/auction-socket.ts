import { io, Socket } from 'socket.io-client';

const getSocketBaseUrl = () => {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';
  return apiBase.replace(/\/api\/v1\/?$/, '');
};

let socket: Socket | null = null;

export const getAuctionSocket = () => {
  if (!socket) {
    socket = io(getSocketBaseUrl(), {
      withCredentials: true,
      transports: ['polling', 'websocket'],
      transportOptions: {
        polling: { withCredentials: true },
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 500,
      reconnectionDelayMax: 2000,
      timeout: 8000,
    });
  }
  return socket;
};

export const disconnectAuctionSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

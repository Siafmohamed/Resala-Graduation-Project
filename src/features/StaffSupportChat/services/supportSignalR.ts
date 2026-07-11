import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { tokenManager } from '@/features/authentication/utils/tokenManager';
import type { SupportChatMessage } from '../types/support';

const getBaseURL = () => {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (envBaseUrl) return envBaseUrl;
  return '/api';
};

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';

class SupportSignalRService {
  private connection: HubConnection | null = null;
  private messageHandlers: ((message: SupportChatMessage) => void)[] = [];
  private statusHandlers: ((status: ConnectionStatus) => void)[] = [];
  private status: ConnectionStatus = 'disconnected';

  public onMessageReceived = (handler: (message: SupportChatMessage) => void) => {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  };

  public onConnectionStatusChanged = (handler: (status: ConnectionStatus) => void) => {
    this.statusHandlers.push(handler);
    return () => {
      this.statusHandlers = this.statusHandlers.filter(h => h !== handler);
    };
  };

  private setStatus = (newStatus: ConnectionStatus) => {
    this.status = newStatus;
    this.statusHandlers.forEach(handler => handler(newStatus));
  };

  public startConnection = async () => {
    if (this.connection?.state === HubConnectionState.Connected) {
      return;
    }

    const token = tokenManager.getAccessToken();
    if (!token) {
      console.error('[SignalR] No access token available');
      this.setStatus('error');
      return;
    }

    try {
      this.setStatus('connecting');

      const baseUrl = getBaseURL();
      let hubUrl: string;
      
      // If baseUrl is '/api', use '/hubs/support' (local dev without env var)
      if (baseUrl === '/api') {
        hubUrl = '/hubs/support';
      } else {
        // If baseUrl ends with '/api', remove it to get to the root
        let normalizedBaseUrl = baseUrl.endsWith('/api') 
          ? baseUrl.slice(0, -4) 
          : baseUrl;
        // Remove trailing slash if present
        normalizedBaseUrl = normalizedBaseUrl.endsWith('/') 
          ? normalizedBaseUrl.slice(0, -1) 
          : normalizedBaseUrl;
        hubUrl = `${normalizedBaseUrl}/hubs/support`;
      }

      const connection = new HubConnectionBuilder()
        .withUrl(`${hubUrl}?access_token=${token}`)
        .withAutomaticReconnect()
        .build();

      connection.on('ReceiveMessage', (message: SupportChatMessage) => {
        this.messageHandlers.forEach(handler => handler(message));
      });

      connection.onreconnecting(() => {
        this.setStatus('reconnecting');
      });

      connection.onreconnected(() => {
        this.setStatus('connected');
      });

      connection.onclose(() => {
        this.setStatus('disconnected');
      });

      await connection.start();
      this.connection = connection;
      this.setStatus('connected');
    } catch (error) {
      console.error('[SignalR] Connection failed:', error);
      this.setStatus('error');
    }
  };

  public stopConnection = async () => {
    if (this.connection) {
      try {
        await this.connection.stop();
        this.connection = null;
        this.setStatus('disconnected');
      } catch (error) {
        console.error('[SignalR] Error stopping connection:', error);
      }
    }
  };

  public sendMessage = async (chatOwnerUserId: string, messageText: string) => {
    if (this.connection?.state !== HubConnectionState.Connected) {
      console.error('[SignalR] Cannot send message: not connected');
      return;
    }

    try {
      await this.connection.invoke('SendMessageToChat', chatOwnerUserId, messageText);
    } catch (error) {
      console.error('[SignalR] Error sending message:', error);
    }
  };

  public getConnectionStatus = () => {
    return this.status;
  };
}

// Singleton instance
export const supportSignalR = new SupportSignalRService();

import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WsPresionService {
    private socket!: WebSocket;
    private messageSubject = new Subject<any>();
    private readonly url = 'ws://3.234.60.137:8002/ws'; 
  
    constructor() {
      this.connect();
    }
  
    private connect(): void {
      try {
        this.socket = new WebSocket(this.url);
  
        this.socket.onopen = () => {
          console.log('[WebSocket] Conexión establecida');
        };
  
        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.messageSubject.next(data);
          } catch (error) {
            console.error('[WebSocket] Error al parsear el mensaje:', error);
          }
        };
  
        this.socket.onerror = (event) => {
          console.error('[WebSocket] Error de conexión:', event);
        };
  
        this.socket.onclose = (event) => {
          console.warn('[WebSocket] Conexión cerrada', event);
          
        };
      } catch (error) {
        console.error('[WebSocket] Error al iniciar la conexión:', error);
      }
    }
  
    getMessages(): Observable<any> {
      return this.messageSubject.asObservable();
    }
  
    ngOnDestroy(): void {
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  